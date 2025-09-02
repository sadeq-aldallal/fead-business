"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeadBusinessStack = void 0;
const cdk = __importStar(require("aws-cdk-lib"));
const s3 = __importStar(require("aws-cdk-lib/aws-s3"));
const cloudfront = __importStar(require("aws-cdk-lib/aws-cloudfront"));
const origins = __importStar(require("aws-cdk-lib/aws-cloudfront-origins"));
const iam = __importStar(require("aws-cdk-lib/aws-iam"));
const acm = __importStar(require("aws-cdk-lib/aws-certificatemanager"));
class FeadBusinessStack extends cdk.Stack {
    bucket;
    distribution;
    constructor(scope, id, props) {
        super(scope, id, props);
        const { stage, domain, certificateArn, landingBucketName } = props;
        // Try to use existing business bucket or create new one
        let businessBucketName = `${stage}-${domain}-business`;
        // Check if this is a new deployment or updating existing
        const createNewBucket = !props.existingDistributionId;
        if (createNewBucket) {
            // Create S3 bucket for business application
            this.bucket = new s3.Bucket(this, 'FeadBusinessBucket', {
                bucketName: businessBucketName,
                websiteIndexDocument: 'index.html',
                websiteErrorDocument: 'index.html',
                publicReadAccess: false,
                blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
                removalPolicy: stage === 'prod' ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
                autoDeleteObjects: stage !== 'prod',
            });
        }
        else {
            // Import existing bucket
            this.bucket = s3.Bucket.fromBucketName(this, 'ExistingBusinessBucket', businessBucketName);
        }
        // Import existing certificate
        const certificate = acm.Certificate.fromCertificateArn(this, 'Certificate', certificateArn);
        // Import existing landing bucket
        const landingBucket = s3.Bucket.fromBucketName(this, 'LandingBucket', landingBucketName);
        // Create Origin Access Control
        const businessOac = new cloudfront.OriginAccessControl(this, 'BusinessOAC', {
            description: `OAC for business bucket ${stage}`,
            originAccessControlOriginType: cloudfront.OriginAccessControlOriginType.S3,
            signing: cloudfront.Signing.SIGV4_ALWAYS,
        });
        const landingOac = new cloudfront.OriginAccessControl(this, 'LandingOAC', {
            description: `OAC for landing bucket ${stage}`,
            originAccessControlOriginType: cloudfront.OriginAccessControlOriginType.S3,
            signing: cloudfront.Signing.SIGV4_ALWAYS,
        });
        // Create CloudFront distribution with both origins
        this.distribution = new cloudfront.Distribution(this, 'FeadCombinedDistribution', {
            comment: `Fead Combined ${stage} distribution`,
            domainNames: stage === 'prod' ? [domain, `www.${domain}`] : [`${stage}.${domain}`],
            certificate: certificate,
            defaultRootObject: 'index.html',
            // Default behavior serves landing page
            defaultBehavior: {
                origin: origins.S3BucketOrigin.withOriginAccessControl(landingBucket, {
                    originAccessControl: landingOac,
                }),
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
                cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
                compress: true,
            },
            // Business behavior for /business/* paths
            additionalBehaviors: {
                '/business/*': {
                    origin: origins.S3BucketOrigin.withOriginAccessControl(this.bucket, {
                        originAccessControl: businessOac,
                    }),
                    viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                    allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
                    cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
                    compress: true,
                    // Custom function to handle SPA routing for business app
                    functionAssociations: [{
                            function: new cloudfront.Function(this, 'BusinessSpaRoutingFunction', {
                                code: cloudfront.FunctionCode.fromInline(`
function handler(event) {
  var request = event.request;
  var uri = request.uri;
  
  // Remove /business prefix for S3 routing
  if (uri.startsWith('/business')) {
    request.uri = uri.substring(9) || '/';
  }
  
  // Handle SPA routing - serve index.html for routes that don't have file extensions
  if (!request.uri.includes('.') && !request.uri.endsWith('/')) {
    request.uri = '/index.html';
  } else if (request.uri.endsWith('/')) {
    request.uri += 'index.html';
  }
  
  return request;
}
              `),
                            }),
                            eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
                        }],
                }
            },
            // Error responses for SPA routing
            errorResponses: [
                {
                    httpStatus: 403,
                    responseHttpStatus: 200,
                    responsePagePath: '/index.html',
                    ttl: cdk.Duration.seconds(0),
                },
                {
                    httpStatus: 404,
                    responseHttpStatus: 200,
                    responsePagePath: '/index.html',
                    ttl: cdk.Duration.seconds(0),
                },
            ],
            priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
        });
        // Grant CloudFront access to both buckets
        if (createNewBucket) {
            this.bucket.addToResourcePolicy(new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                principals: [new iam.ServicePrincipal('cloudfront.amazonaws.com')],
                actions: ['s3:GetObject'],
                resources: [`${this.bucket.bucketArn}/*`],
                conditions: {
                    StringEquals: {
                        'AWS:SourceArn': `arn:aws:cloudfront::${this.account}:distribution/${this.distribution.distributionId}`,
                    },
                },
            }));
        }
        // Note: Landing bucket permissions should be managed by landing stack
        // Outputs
        new cdk.CfnOutput(this, 'BusinessBucketName', {
            value: this.bucket.bucketName,
            description: 'Business S3 Bucket Name',
            exportName: `${stage}-fead-business-bucket`,
        });
        new cdk.CfnOutput(this, 'CombinedDistributionId', {
            value: this.distribution.distributionId,
            description: 'Combined CloudFront Distribution ID',
            exportName: `${stage}-fead-combined-distribution-id`,
        });
        new cdk.CfnOutput(this, 'CombinedDistributionDomain', {
            value: this.distribution.domainName,
            description: 'Combined CloudFront Distribution Domain',
            exportName: `${stage}-fead-combined-distribution-domain`,
        });
        new cdk.CfnOutput(this, 'BusinessUrl', {
            value: stage === 'prod' ? `https://${domain}/business` : `https://${stage}.${domain}/business`,
            description: 'Business App URL',
            exportName: `${stage}-fead-business-url`,
        });
        new cdk.CfnOutput(this, 'LandingUrl', {
            value: stage === 'prod' ? `https://${domain}` : `https://${stage}.${domain}`,
            description: 'Landing Page URL',
            exportName: `${stage}-fead-landing-url`,
        });
    }
}
exports.FeadBusinessStack = FeadBusinessStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmVhZC1idXNpbmVzcy1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZlYWQtYnVzaW5lc3Mtc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpREFBbUM7QUFDbkMsdURBQXlDO0FBQ3pDLHVFQUF5RDtBQUN6RCw0RUFBOEQ7QUFDOUQseURBQTJDO0FBQzNDLHdFQUEwRDtBQVcxRCxNQUFhLGlCQUFrQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQzlCLE1BQU0sQ0FBWTtJQUNsQixZQUFZLENBQTBCO0lBRXRELFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBNkI7UUFDckUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFFLGlCQUFpQixFQUFFLEdBQUcsS0FBSyxDQUFDO1FBRW5FLHdEQUF3RDtRQUN4RCxJQUFJLGtCQUFrQixHQUFHLEdBQUcsS0FBSyxJQUFJLE1BQU0sV0FBVyxDQUFDO1FBRXZELHlEQUF5RDtRQUN6RCxNQUFNLGVBQWUsR0FBRyxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQztRQUV0RCxJQUFJLGVBQWUsRUFBRSxDQUFDO1lBQ3BCLDRDQUE0QztZQUM1QyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsb0JBQW9CLEVBQUU7Z0JBQ3RELFVBQVUsRUFBRSxrQkFBa0I7Z0JBQzlCLG9CQUFvQixFQUFFLFlBQVk7Z0JBQ2xDLG9CQUFvQixFQUFFLFlBQVk7Z0JBQ2xDLGdCQUFnQixFQUFFLEtBQUs7Z0JBQ3ZCLGlCQUFpQixFQUFFLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTO2dCQUNqRCxhQUFhLEVBQUUsS0FBSyxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTztnQkFDdEYsaUJBQWlCLEVBQUUsS0FBSyxLQUFLLE1BQU07YUFDcEMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQzthQUFNLENBQUM7WUFDTix5QkFBeUI7WUFDekIsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsd0JBQXdCLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztRQUM3RixDQUFDO1FBRUQsOEJBQThCO1FBQzlCLE1BQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQ3BELElBQUksRUFDSixhQUFhLEVBQ2IsY0FBYyxDQUNmLENBQUM7UUFFRixpQ0FBaUM7UUFDakMsTUFBTSxhQUFhLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQzVDLElBQUksRUFDSixlQUFlLEVBQ2YsaUJBQWlCLENBQ2xCLENBQUM7UUFFRiwrQkFBK0I7UUFDL0IsTUFBTSxXQUFXLEdBQUcsSUFBSSxVQUFVLENBQUMsbUJBQW1CLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRTtZQUMxRSxXQUFXLEVBQUUsMkJBQTJCLEtBQUssRUFBRTtZQUMvQyw2QkFBNkIsRUFBRSxVQUFVLENBQUMsNkJBQTZCLENBQUMsRUFBRTtZQUMxRSxPQUFPLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQyxZQUFZO1NBQ3pDLENBQUMsQ0FBQztRQUVILE1BQU0sVUFBVSxHQUFHLElBQUksVUFBVSxDQUFDLG1CQUFtQixDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDeEUsV0FBVyxFQUFFLDBCQUEwQixLQUFLLEVBQUU7WUFDOUMsNkJBQTZCLEVBQUUsVUFBVSxDQUFDLDZCQUE2QixDQUFDLEVBQUU7WUFDMUUsT0FBTyxFQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsWUFBWTtTQUN6QyxDQUFDLENBQUM7UUFFSCxtREFBbUQ7UUFDbkQsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLFVBQVUsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLDBCQUEwQixFQUFFO1lBQ2hGLE9BQU8sRUFBRSxpQkFBaUIsS0FBSyxlQUFlO1lBQzlDLFdBQVcsRUFBRSxLQUFLLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxPQUFPLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLElBQUksTUFBTSxFQUFFLENBQUM7WUFDbEYsV0FBVyxFQUFFLFdBQVc7WUFDeEIsaUJBQWlCLEVBQUUsWUFBWTtZQUUvQix1Q0FBdUM7WUFDdkMsZUFBZSxFQUFFO2dCQUNmLE1BQU0sRUFBRSxPQUFPLENBQUMsY0FBYyxDQUFDLHVCQUF1QixDQUFDLGFBQWEsRUFBRTtvQkFDcEUsbUJBQW1CLEVBQUUsVUFBVTtpQkFDaEMsQ0FBQztnQkFDRixvQkFBb0IsRUFBRSxVQUFVLENBQUMsb0JBQW9CLENBQUMsaUJBQWlCO2dCQUN2RSxjQUFjLEVBQUUsVUFBVSxDQUFDLGNBQWMsQ0FBQyxzQkFBc0I7Z0JBQ2hFLFdBQVcsRUFBRSxVQUFVLENBQUMsV0FBVyxDQUFDLGlCQUFpQjtnQkFDckQsUUFBUSxFQUFFLElBQUk7YUFDZjtZQUVELDBDQUEwQztZQUMxQyxtQkFBbUIsRUFBRTtnQkFDbkIsYUFBYSxFQUFFO29CQUNiLE1BQU0sRUFBRSxPQUFPLENBQUMsY0FBYyxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7d0JBQ2xFLG1CQUFtQixFQUFFLFdBQVc7cUJBQ2pDLENBQUM7b0JBQ0Ysb0JBQW9CLEVBQUUsVUFBVSxDQUFDLG9CQUFvQixDQUFDLGlCQUFpQjtvQkFDdkUsY0FBYyxFQUFFLFVBQVUsQ0FBQyxjQUFjLENBQUMsc0JBQXNCO29CQUNoRSxXQUFXLEVBQUUsVUFBVSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUI7b0JBQ3JELFFBQVEsRUFBRSxJQUFJO29CQUNkLHlEQUF5RDtvQkFDekQsb0JBQW9CLEVBQUUsQ0FBQzs0QkFDckIsUUFBUSxFQUFFLElBQUksVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsNEJBQTRCLEVBQUU7Z0NBQ3BFLElBQUksRUFBRSxVQUFVLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztlQW1CeEMsQ0FBQzs2QkFDSCxDQUFDOzRCQUNGLFNBQVMsRUFBRSxVQUFVLENBQUMsaUJBQWlCLENBQUMsY0FBYzt5QkFDdkQsQ0FBQztpQkFDSDthQUNGO1lBRUQsa0NBQWtDO1lBQ2xDLGNBQWMsRUFBRTtnQkFDZDtvQkFDRSxVQUFVLEVBQUUsR0FBRztvQkFDZixrQkFBa0IsRUFBRSxHQUFHO29CQUN2QixnQkFBZ0IsRUFBRSxhQUFhO29CQUMvQixHQUFHLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2lCQUM3QjtnQkFDRDtvQkFDRSxVQUFVLEVBQUUsR0FBRztvQkFDZixrQkFBa0IsRUFBRSxHQUFHO29CQUN2QixnQkFBZ0IsRUFBRSxhQUFhO29CQUMvQixHQUFHLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2lCQUM3QjthQUNGO1lBRUQsVUFBVSxFQUFFLFVBQVUsQ0FBQyxVQUFVLENBQUMsZUFBZTtTQUNsRCxDQUFDLENBQUM7UUFFSCwwQ0FBMEM7UUFDMUMsSUFBSSxlQUFlLEVBQUUsQ0FBQztZQUNwQixJQUFJLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQztnQkFDdEQsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSztnQkFDeEIsVUFBVSxFQUFFLENBQUMsSUFBSSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsMEJBQTBCLENBQUMsQ0FBQztnQkFDbEUsT0FBTyxFQUFFLENBQUMsY0FBYyxDQUFDO2dCQUN6QixTQUFTLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxJQUFJLENBQUM7Z0JBQ3pDLFVBQVUsRUFBRTtvQkFDVixZQUFZLEVBQUU7d0JBQ1osZUFBZSxFQUFFLHVCQUF1QixJQUFJLENBQUMsT0FBTyxpQkFBaUIsSUFBSSxDQUFDLFlBQVksQ0FBQyxjQUFjLEVBQUU7cUJBQ3hHO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDLENBQUM7UUFDTixDQUFDO1FBRUQsc0VBQXNFO1FBRXRFLFVBQVU7UUFDVixJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLG9CQUFvQixFQUFFO1lBQzVDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVU7WUFDN0IsV0FBVyxFQUFFLHlCQUF5QjtZQUN0QyxVQUFVLEVBQUUsR0FBRyxLQUFLLHVCQUF1QjtTQUM1QyxDQUFDLENBQUM7UUFFSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLHdCQUF3QixFQUFFO1lBQ2hELEtBQUssRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLGNBQWM7WUFDdkMsV0FBVyxFQUFFLHFDQUFxQztZQUNsRCxVQUFVLEVBQUUsR0FBRyxLQUFLLGdDQUFnQztTQUNyRCxDQUFDLENBQUM7UUFFSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLDRCQUE0QixFQUFFO1lBQ3BELEtBQUssRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVU7WUFDbkMsV0FBVyxFQUFFLHlDQUF5QztZQUN0RCxVQUFVLEVBQUUsR0FBRyxLQUFLLG9DQUFvQztTQUN6RCxDQUFDLENBQUM7UUFFSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRTtZQUNyQyxLQUFLLEVBQUUsS0FBSyxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsV0FBVyxNQUFNLFdBQVcsQ0FBQyxDQUFDLENBQUMsV0FBVyxLQUFLLElBQUksTUFBTSxXQUFXO1lBQzlGLFdBQVcsRUFBRSxrQkFBa0I7WUFDL0IsVUFBVSxFQUFFLEdBQUcsS0FBSyxvQkFBb0I7U0FDekMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDcEMsS0FBSyxFQUFFLEtBQUssS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDLFdBQVcsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsS0FBSyxJQUFJLE1BQU0sRUFBRTtZQUM1RSxXQUFXLEVBQUUsa0JBQWtCO1lBQy9CLFVBQVUsRUFBRSxHQUFHLEtBQUssbUJBQW1CO1NBQ3hDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQXRMRCw4Q0FzTEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzJztcbmltcG9ydCAqIGFzIGNsb3VkZnJvbnQgZnJvbSAnYXdzLWNkay1saWIvYXdzLWNsb3VkZnJvbnQnO1xuaW1wb3J0ICogYXMgb3JpZ2lucyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY2xvdWRmcm9udC1vcmlnaW5zJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGFjbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY2VydGlmaWNhdGVtYW5hZ2VyJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEZlYWRCdXNpbmVzc1N0YWNrUHJvcHMgZXh0ZW5kcyBjZGsuU3RhY2tQcm9wcyB7XG4gIHN0YWdlOiBzdHJpbmc7XG4gIGRvbWFpbjogc3RyaW5nO1xuICBjZXJ0aWZpY2F0ZUFybjogc3RyaW5nO1xuICBleGlzdGluZ0Rpc3RyaWJ1dGlvbklkPzogc3RyaW5nO1xuICBsYW5kaW5nQnVja2V0TmFtZTogc3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgRmVhZEJ1c2luZXNzU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBwdWJsaWMgcmVhZG9ubHkgYnVja2V0OiBzMy5CdWNrZXQ7XG4gIHB1YmxpYyByZWFkb25seSBkaXN0cmlidXRpb246IGNsb3VkZnJvbnQuRGlzdHJpYnV0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBGZWFkQnVzaW5lc3NTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCB7IHN0YWdlLCBkb21haW4sIGNlcnRpZmljYXRlQXJuLCBsYW5kaW5nQnVja2V0TmFtZSB9ID0gcHJvcHM7XG5cbiAgICAvLyBUcnkgdG8gdXNlIGV4aXN0aW5nIGJ1c2luZXNzIGJ1Y2tldCBvciBjcmVhdGUgbmV3IG9uZVxuICAgIGxldCBidXNpbmVzc0J1Y2tldE5hbWUgPSBgJHtzdGFnZX0tJHtkb21haW59LWJ1c2luZXNzYDtcbiAgICBcbiAgICAvLyBDaGVjayBpZiB0aGlzIGlzIGEgbmV3IGRlcGxveW1lbnQgb3IgdXBkYXRpbmcgZXhpc3RpbmdcbiAgICBjb25zdCBjcmVhdGVOZXdCdWNrZXQgPSAhcHJvcHMuZXhpc3RpbmdEaXN0cmlidXRpb25JZDtcbiAgICBcbiAgICBpZiAoY3JlYXRlTmV3QnVja2V0KSB7XG4gICAgICAvLyBDcmVhdGUgUzMgYnVja2V0IGZvciBidXNpbmVzcyBhcHBsaWNhdGlvblxuICAgICAgdGhpcy5idWNrZXQgPSBuZXcgczMuQnVja2V0KHRoaXMsICdGZWFkQnVzaW5lc3NCdWNrZXQnLCB7XG4gICAgICAgIGJ1Y2tldE5hbWU6IGJ1c2luZXNzQnVja2V0TmFtZSxcbiAgICAgICAgd2Vic2l0ZUluZGV4RG9jdW1lbnQ6ICdpbmRleC5odG1sJyxcbiAgICAgICAgd2Vic2l0ZUVycm9yRG9jdW1lbnQ6ICdpbmRleC5odG1sJyxcbiAgICAgICAgcHVibGljUmVhZEFjY2VzczogZmFsc2UsXG4gICAgICAgIGJsb2NrUHVibGljQWNjZXNzOiBzMy5CbG9ja1B1YmxpY0FjY2Vzcy5CTE9DS19BTEwsXG4gICAgICAgIHJlbW92YWxQb2xpY3k6IHN0YWdlID09PSAncHJvZCcgPyBjZGsuUmVtb3ZhbFBvbGljeS5SRVRBSU4gOiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgICAgICBhdXRvRGVsZXRlT2JqZWN0czogc3RhZ2UgIT09ICdwcm9kJyxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJbXBvcnQgZXhpc3RpbmcgYnVja2V0XG4gICAgICB0aGlzLmJ1Y2tldCA9IHMzLkJ1Y2tldC5mcm9tQnVja2V0TmFtZSh0aGlzLCAnRXhpc3RpbmdCdXNpbmVzc0J1Y2tldCcsIGJ1c2luZXNzQnVja2V0TmFtZSk7XG4gICAgfVxuXG4gICAgLy8gSW1wb3J0IGV4aXN0aW5nIGNlcnRpZmljYXRlXG4gICAgY29uc3QgY2VydGlmaWNhdGUgPSBhY20uQ2VydGlmaWNhdGUuZnJvbUNlcnRpZmljYXRlQXJuKFxuICAgICAgdGhpcyxcbiAgICAgICdDZXJ0aWZpY2F0ZScsXG4gICAgICBjZXJ0aWZpY2F0ZUFyblxuICAgICk7XG5cbiAgICAvLyBJbXBvcnQgZXhpc3RpbmcgbGFuZGluZyBidWNrZXRcbiAgICBjb25zdCBsYW5kaW5nQnVja2V0ID0gczMuQnVja2V0LmZyb21CdWNrZXROYW1lKFxuICAgICAgdGhpcyxcbiAgICAgICdMYW5kaW5nQnVja2V0JyxcbiAgICAgIGxhbmRpbmdCdWNrZXROYW1lXG4gICAgKTtcblxuICAgIC8vIENyZWF0ZSBPcmlnaW4gQWNjZXNzIENvbnRyb2xcbiAgICBjb25zdCBidXNpbmVzc09hYyA9IG5ldyBjbG91ZGZyb250Lk9yaWdpbkFjY2Vzc0NvbnRyb2wodGhpcywgJ0J1c2luZXNzT0FDJywge1xuICAgICAgZGVzY3JpcHRpb246IGBPQUMgZm9yIGJ1c2luZXNzIGJ1Y2tldCAke3N0YWdlfWAsXG4gICAgICBvcmlnaW5BY2Nlc3NDb250cm9sT3JpZ2luVHlwZTogY2xvdWRmcm9udC5PcmlnaW5BY2Nlc3NDb250cm9sT3JpZ2luVHlwZS5TMyxcbiAgICAgIHNpZ25pbmc6IGNsb3VkZnJvbnQuU2lnbmluZy5TSUdWNF9BTFdBWVMsXG4gICAgfSk7XG5cbiAgICBjb25zdCBsYW5kaW5nT2FjID0gbmV3IGNsb3VkZnJvbnQuT3JpZ2luQWNjZXNzQ29udHJvbCh0aGlzLCAnTGFuZGluZ09BQycsIHtcbiAgICAgIGRlc2NyaXB0aW9uOiBgT0FDIGZvciBsYW5kaW5nIGJ1Y2tldCAke3N0YWdlfWAsXG4gICAgICBvcmlnaW5BY2Nlc3NDb250cm9sT3JpZ2luVHlwZTogY2xvdWRmcm9udC5PcmlnaW5BY2Nlc3NDb250cm9sT3JpZ2luVHlwZS5TMyxcbiAgICAgIHNpZ25pbmc6IGNsb3VkZnJvbnQuU2lnbmluZy5TSUdWNF9BTFdBWVMsXG4gICAgfSk7XG5cbiAgICAvLyBDcmVhdGUgQ2xvdWRGcm9udCBkaXN0cmlidXRpb24gd2l0aCBib3RoIG9yaWdpbnNcbiAgICB0aGlzLmRpc3RyaWJ1dGlvbiA9IG5ldyBjbG91ZGZyb250LkRpc3RyaWJ1dGlvbih0aGlzLCAnRmVhZENvbWJpbmVkRGlzdHJpYnV0aW9uJywge1xuICAgICAgY29tbWVudDogYEZlYWQgQ29tYmluZWQgJHtzdGFnZX0gZGlzdHJpYnV0aW9uYCxcbiAgICAgIGRvbWFpbk5hbWVzOiBzdGFnZSA9PT0gJ3Byb2QnID8gW2RvbWFpbiwgYHd3dy4ke2RvbWFpbn1gXSA6IFtgJHtzdGFnZX0uJHtkb21haW59YF0sXG4gICAgICBjZXJ0aWZpY2F0ZTogY2VydGlmaWNhdGUsXG4gICAgICBkZWZhdWx0Um9vdE9iamVjdDogJ2luZGV4Lmh0bWwnLFxuICAgICAgXG4gICAgICAvLyBEZWZhdWx0IGJlaGF2aW9yIHNlcnZlcyBsYW5kaW5nIHBhZ2VcbiAgICAgIGRlZmF1bHRCZWhhdmlvcjoge1xuICAgICAgICBvcmlnaW46IG9yaWdpbnMuUzNCdWNrZXRPcmlnaW4ud2l0aE9yaWdpbkFjY2Vzc0NvbnRyb2wobGFuZGluZ0J1Y2tldCwge1xuICAgICAgICAgIG9yaWdpbkFjY2Vzc0NvbnRyb2w6IGxhbmRpbmdPYWMsXG4gICAgICAgIH0pLFxuICAgICAgICB2aWV3ZXJQcm90b2NvbFBvbGljeTogY2xvdWRmcm9udC5WaWV3ZXJQcm90b2NvbFBvbGljeS5SRURJUkVDVF9UT19IVFRQUyxcbiAgICAgICAgYWxsb3dlZE1ldGhvZHM6IGNsb3VkZnJvbnQuQWxsb3dlZE1ldGhvZHMuQUxMT1dfR0VUX0hFQURfT1BUSU9OUyxcbiAgICAgICAgY2FjaGVQb2xpY3k6IGNsb3VkZnJvbnQuQ2FjaGVQb2xpY3kuQ0FDSElOR19PUFRJTUlaRUQsXG4gICAgICAgIGNvbXByZXNzOiB0cnVlLFxuICAgICAgfSxcblxuICAgICAgLy8gQnVzaW5lc3MgYmVoYXZpb3IgZm9yIC9idXNpbmVzcy8qIHBhdGhzXG4gICAgICBhZGRpdGlvbmFsQmVoYXZpb3JzOiB7XG4gICAgICAgICcvYnVzaW5lc3MvKic6IHtcbiAgICAgICAgICBvcmlnaW46IG9yaWdpbnMuUzNCdWNrZXRPcmlnaW4ud2l0aE9yaWdpbkFjY2Vzc0NvbnRyb2wodGhpcy5idWNrZXQsIHtcbiAgICAgICAgICAgIG9yaWdpbkFjY2Vzc0NvbnRyb2w6IGJ1c2luZXNzT2FjLFxuICAgICAgICAgIH0pLFxuICAgICAgICAgIHZpZXdlclByb3RvY29sUG9saWN5OiBjbG91ZGZyb250LlZpZXdlclByb3RvY29sUG9saWN5LlJFRElSRUNUX1RPX0hUVFBTLFxuICAgICAgICAgIGFsbG93ZWRNZXRob2RzOiBjbG91ZGZyb250LkFsbG93ZWRNZXRob2RzLkFMTE9XX0dFVF9IRUFEX09QVElPTlMsXG4gICAgICAgICAgY2FjaGVQb2xpY3k6IGNsb3VkZnJvbnQuQ2FjaGVQb2xpY3kuQ0FDSElOR19PUFRJTUlaRUQsXG4gICAgICAgICAgY29tcHJlc3M6IHRydWUsXG4gICAgICAgICAgLy8gQ3VzdG9tIGZ1bmN0aW9uIHRvIGhhbmRsZSBTUEEgcm91dGluZyBmb3IgYnVzaW5lc3MgYXBwXG4gICAgICAgICAgZnVuY3Rpb25Bc3NvY2lhdGlvbnM6IFt7XG4gICAgICAgICAgICBmdW5jdGlvbjogbmV3IGNsb3VkZnJvbnQuRnVuY3Rpb24odGhpcywgJ0J1c2luZXNzU3BhUm91dGluZ0Z1bmN0aW9uJywge1xuICAgICAgICAgICAgICBjb2RlOiBjbG91ZGZyb250LkZ1bmN0aW9uQ29kZS5mcm9tSW5saW5lKGBcbmZ1bmN0aW9uIGhhbmRsZXIoZXZlbnQpIHtcbiAgdmFyIHJlcXVlc3QgPSBldmVudC5yZXF1ZXN0O1xuICB2YXIgdXJpID0gcmVxdWVzdC51cmk7XG4gIFxuICAvLyBSZW1vdmUgL2J1c2luZXNzIHByZWZpeCBmb3IgUzMgcm91dGluZ1xuICBpZiAodXJpLnN0YXJ0c1dpdGgoJy9idXNpbmVzcycpKSB7XG4gICAgcmVxdWVzdC51cmkgPSB1cmkuc3Vic3RyaW5nKDkpIHx8ICcvJztcbiAgfVxuICBcbiAgLy8gSGFuZGxlIFNQQSByb3V0aW5nIC0gc2VydmUgaW5kZXguaHRtbCBmb3Igcm91dGVzIHRoYXQgZG9uJ3QgaGF2ZSBmaWxlIGV4dGVuc2lvbnNcbiAgaWYgKCFyZXF1ZXN0LnVyaS5pbmNsdWRlcygnLicpICYmICFyZXF1ZXN0LnVyaS5lbmRzV2l0aCgnLycpKSB7XG4gICAgcmVxdWVzdC51cmkgPSAnL2luZGV4Lmh0bWwnO1xuICB9IGVsc2UgaWYgKHJlcXVlc3QudXJpLmVuZHNXaXRoKCcvJykpIHtcbiAgICByZXF1ZXN0LnVyaSArPSAnaW5kZXguaHRtbCc7XG4gIH1cbiAgXG4gIHJldHVybiByZXF1ZXN0O1xufVxuICAgICAgICAgICAgICBgKSxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgZXZlbnRUeXBlOiBjbG91ZGZyb250LkZ1bmN0aW9uRXZlbnRUeXBlLlZJRVdFUl9SRVFVRVNULFxuICAgICAgICAgIH1dLFxuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvLyBFcnJvciByZXNwb25zZXMgZm9yIFNQQSByb3V0aW5nXG4gICAgICBlcnJvclJlc3BvbnNlczogW1xuICAgICAgICB7XG4gICAgICAgICAgaHR0cFN0YXR1czogNDAzLFxuICAgICAgICAgIHJlc3BvbnNlSHR0cFN0YXR1czogMjAwLFxuICAgICAgICAgIHJlc3BvbnNlUGFnZVBhdGg6ICcvaW5kZXguaHRtbCcsXG4gICAgICAgICAgdHRsOiBjZGsuRHVyYXRpb24uc2Vjb25kcygwKSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGh0dHBTdGF0dXM6IDQwNCxcbiAgICAgICAgICByZXNwb25zZUh0dHBTdGF0dXM6IDIwMCxcbiAgICAgICAgICByZXNwb25zZVBhZ2VQYXRoOiAnL2luZGV4Lmh0bWwnLFxuICAgICAgICAgIHR0bDogY2RrLkR1cmF0aW9uLnNlY29uZHMoMCksXG4gICAgICAgIH0sXG4gICAgICBdLFxuXG4gICAgICBwcmljZUNsYXNzOiBjbG91ZGZyb250LlByaWNlQ2xhc3MuUFJJQ0VfQ0xBU1NfMTAwLFxuICAgIH0pO1xuXG4gICAgLy8gR3JhbnQgQ2xvdWRGcm9udCBhY2Nlc3MgdG8gYm90aCBidWNrZXRzXG4gICAgaWYgKGNyZWF0ZU5ld0J1Y2tldCkge1xuICAgICAgdGhpcy5idWNrZXQuYWRkVG9SZXNvdXJjZVBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgIGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcbiAgICAgICAgcHJpbmNpcGFsczogW25ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnY2xvdWRmcm9udC5hbWF6b25hd3MuY29tJyldLFxuICAgICAgICBhY3Rpb25zOiBbJ3MzOkdldE9iamVjdCddLFxuICAgICAgICByZXNvdXJjZXM6IFtgJHt0aGlzLmJ1Y2tldC5idWNrZXRBcm59LypgXSxcbiAgICAgICAgY29uZGl0aW9uczoge1xuICAgICAgICAgIFN0cmluZ0VxdWFsczoge1xuICAgICAgICAgICAgJ0FXUzpTb3VyY2VBcm4nOiBgYXJuOmF3czpjbG91ZGZyb250Ojoke3RoaXMuYWNjb3VudH06ZGlzdHJpYnV0aW9uLyR7dGhpcy5kaXN0cmlidXRpb24uZGlzdHJpYnV0aW9uSWR9YCxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSkpO1xuICAgIH1cblxuICAgIC8vIE5vdGU6IExhbmRpbmcgYnVja2V0IHBlcm1pc3Npb25zIHNob3VsZCBiZSBtYW5hZ2VkIGJ5IGxhbmRpbmcgc3RhY2tcblxuICAgIC8vIE91dHB1dHNcbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnQnVzaW5lc3NCdWNrZXROYW1lJywge1xuICAgICAgdmFsdWU6IHRoaXMuYnVja2V0LmJ1Y2tldE5hbWUsXG4gICAgICBkZXNjcmlwdGlvbjogJ0J1c2luZXNzIFMzIEJ1Y2tldCBOYW1lJyxcbiAgICAgIGV4cG9ydE5hbWU6IGAke3N0YWdlfS1mZWFkLWJ1c2luZXNzLWJ1Y2tldGAsXG4gICAgfSk7XG5cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnQ29tYmluZWREaXN0cmlidXRpb25JZCcsIHtcbiAgICAgIHZhbHVlOiB0aGlzLmRpc3RyaWJ1dGlvbi5kaXN0cmlidXRpb25JZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnQ29tYmluZWQgQ2xvdWRGcm9udCBEaXN0cmlidXRpb24gSUQnLFxuICAgICAgZXhwb3J0TmFtZTogYCR7c3RhZ2V9LWZlYWQtY29tYmluZWQtZGlzdHJpYnV0aW9uLWlkYCxcbiAgICB9KTtcblxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdDb21iaW5lZERpc3RyaWJ1dGlvbkRvbWFpbicsIHtcbiAgICAgIHZhbHVlOiB0aGlzLmRpc3RyaWJ1dGlvbi5kb21haW5OYW1lLFxuICAgICAgZGVzY3JpcHRpb246ICdDb21iaW5lZCBDbG91ZEZyb250IERpc3RyaWJ1dGlvbiBEb21haW4nLFxuICAgICAgZXhwb3J0TmFtZTogYCR7c3RhZ2V9LWZlYWQtY29tYmluZWQtZGlzdHJpYnV0aW9uLWRvbWFpbmAsXG4gICAgfSk7XG5cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnQnVzaW5lc3NVcmwnLCB7XG4gICAgICB2YWx1ZTogc3RhZ2UgPT09ICdwcm9kJyA/IGBodHRwczovLyR7ZG9tYWlufS9idXNpbmVzc2AgOiBgaHR0cHM6Ly8ke3N0YWdlfS4ke2RvbWFpbn0vYnVzaW5lc3NgLFxuICAgICAgZGVzY3JpcHRpb246ICdCdXNpbmVzcyBBcHAgVVJMJyxcbiAgICAgIGV4cG9ydE5hbWU6IGAke3N0YWdlfS1mZWFkLWJ1c2luZXNzLXVybGAsXG4gICAgfSk7XG5cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnTGFuZGluZ1VybCcsIHtcbiAgICAgIHZhbHVlOiBzdGFnZSA9PT0gJ3Byb2QnID8gYGh0dHBzOi8vJHtkb21haW59YCA6IGBodHRwczovLyR7c3RhZ2V9LiR7ZG9tYWlufWAsXG4gICAgICBkZXNjcmlwdGlvbjogJ0xhbmRpbmcgUGFnZSBVUkwnLCBcbiAgICAgIGV4cG9ydE5hbWU6IGAke3N0YWdlfS1mZWFkLWxhbmRpbmctdXJsYCxcbiAgICB9KTtcbiAgfVxufSJdfQ==