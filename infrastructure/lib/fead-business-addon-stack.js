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
exports.FeadBusinessAddonStack = void 0;
const cdk = __importStar(require("aws-cdk-lib"));
const s3 = __importStar(require("aws-cdk-lib/aws-s3"));
const cloudfront = __importStar(require("aws-cdk-lib/aws-cloudfront"));
const iam = __importStar(require("aws-cdk-lib/aws-iam"));
class FeadBusinessAddonStack extends cdk.Stack {
    bucket;
    constructor(scope, id, props) {
        super(scope, id, props);
        const { stage, domain, existingDistributionId, landingBucketName } = props;
        // Create S3 bucket for business application
        this.bucket = new s3.Bucket(this, 'FeadBusinessBucket', {
            bucketName: `${stage}-${domain}-business`,
            websiteIndexDocument: 'index.html',
            websiteErrorDocument: 'index.html', // SPA routing
            publicReadAccess: false, // We'll use OAC instead
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            removalPolicy: stage === 'prod' ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: stage !== 'prod',
        });
        // Import the existing CloudFront distribution
        const existingDistribution = cloudfront.Distribution.fromDistributionAttributes(this, 'ExistingDistribution', {
            distributionId: existingDistributionId,
            domainName: stage === 'prod' ? domain : `${stage}.${domain}`, // This should match the actual distribution domain
        });
        // Create Origin Access Control for business bucket
        const businessOac = new cloudfront.OriginAccessControl(this, 'BusinessOAC', {
            description: `OAC for business bucket ${stage}`,
            originAccessControlOriginType: cloudfront.OriginAccessControlOriginType.S3,
            signing: cloudfront.Signing.SIGV4_ALWAYS,
        });
        // Grant CloudFront access to business bucket
        this.bucket.addToResourcePolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            principals: [new iam.ServicePrincipal('cloudfront.amazonaws.com')],
            actions: ['s3:GetObject'],
            resources: [`${this.bucket.bucketArn}/*`],
            conditions: {
                StringEquals: {
                    'AWS:SourceArn': `arn:aws:cloudfront::${this.account}:distribution/${existingDistributionId}`,
                },
            },
        }));
        // We can't directly modify the existing CloudFront distribution through CDK
        // This will need to be done manually or through AWS CLI/API
        // The business bucket is ready and has the correct permissions
        // Create a custom resource to add the behavior
        const updateDistributionFunction = new cdk.CustomResource(this, 'UpdateCloudFrontDistribution', {
            serviceToken: this.createUpdateDistributionProvider().serviceToken,
            properties: {
                DistributionId: existingDistributionId,
                BusinessBucketName: this.bucket.bucketName,
                BusinessOriginId: `${stage}-business-origin`,
                OACId: businessOac.originAccessControlId,
            },
        });
        // Outputs
        new cdk.CfnOutput(this, 'BusinessBucketName', {
            value: this.bucket.bucketName,
            description: 'Business S3 Bucket Name',
            exportName: `${stage}-fead-business-bucket`,
        });
        new cdk.CfnOutput(this, 'ExistingDistributionId', {
            value: existingDistributionId,
            description: 'Existing CloudFront Distribution ID',
            exportName: `${stage}-fead-existing-distribution-id`,
        });
        new cdk.CfnOutput(this, 'BusinessUrl', {
            value: stage === 'prod' ? `https://${domain}/business` : `https://${stage}.${domain}/business`,
            description: 'Business App URL',
            exportName: `${stage}-fead-business-url`,
        });
        new cdk.CfnOutput(this, 'DeploymentInstructions', {
            value: `Use 'aws cloudfront create-invalidation --distribution-id ${existingDistributionId} --paths "/business/*"' to invalidate cache`,
            description: 'Cache invalidation command for business app',
        });
    }
    createUpdateDistributionProvider() {
        // This would create a Lambda function to update the CloudFront distribution
        // For now, we'll provide manual instructions
        return new cdk.Provider(this, 'UpdateDistributionProvider', {
            onEventHandler: new cdk.aws_lambda.Function(this, 'UpdateDistributionHandler', {
                runtime: cdk.aws_lambda.Runtime.PYTHON_3_9,
                handler: 'index.handler',
                code: cdk.aws_lambda.Code.fromInline(`
import boto3
import json

def handler(event, context):
    # This would update the CloudFront distribution to add the business behavior
    # For now, return success and let user handle manually
    return {
        'Status': 'SUCCESS',
        'Reason': 'Manual update required',
        'PhysicalResourceId': 'update-distribution',
        'Data': {}
    }
        `),
            }),
        });
    }
}
exports.FeadBusinessAddonStack = FeadBusinessAddonStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmVhZC1idXNpbmVzcy1hZGRvbi1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZlYWQtYnVzaW5lc3MtYWRkb24tc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpREFBbUM7QUFDbkMsdURBQXlDO0FBQ3pDLHVFQUF5RDtBQUV6RCx5REFBMkM7QUFVM0MsTUFBYSxzQkFBdUIsU0FBUSxHQUFHLENBQUMsS0FBSztJQUNuQyxNQUFNLENBQVk7SUFFbEMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFrQztRQUMxRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxzQkFBc0IsRUFBRSxpQkFBaUIsRUFBRSxHQUFHLEtBQUssQ0FBQztRQUUzRSw0Q0FBNEM7UUFDNUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLG9CQUFvQixFQUFFO1lBQ3RELFVBQVUsRUFBRSxHQUFHLEtBQUssSUFBSSxNQUFNLFdBQVc7WUFDekMsb0JBQW9CLEVBQUUsWUFBWTtZQUNsQyxvQkFBb0IsRUFBRSxZQUFZLEVBQUUsY0FBYztZQUNsRCxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsd0JBQXdCO1lBQ2pELGlCQUFpQixFQUFFLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTO1lBQ2pELGFBQWEsRUFBRSxLQUFLLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPO1lBQ3RGLGlCQUFpQixFQUFFLEtBQUssS0FBSyxNQUFNO1NBQ3BDLENBQUMsQ0FBQztRQUVILDhDQUE4QztRQUM5QyxNQUFNLG9CQUFvQixHQUFHLFVBQVUsQ0FBQyxZQUFZ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QUMsQ0FBQztJQUNMLENBQUM7SUFFTyxnQ0FBZ0M7UUFDdEMsNEVBQTRFO1FBQzVFLDZDQUE2QztRQUM3QyxPQUFPLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsNEJBQTRCLEVBQUU7WUFDMUQsY0FBYyxFQUFFLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLDJCQUEyQixFQUFFO2dCQUM3RSxPQUFPLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsVUFBVTtnQkFDMUMsT0FBTyxFQUFFLGVBQWU7Z0JBQ3hCLElBQUksRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7Ozs7Ozs7Ozs7Ozs7U0FhcEMsQ0FBQzthQUNILENBQUM7U0FDSCxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFqSEQsd0RBaUhDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XG5pbXBvcnQgKiBhcyBjbG91ZGZyb250IGZyb20gJ2F3cy1jZGstbGliL2F3cy1jbG91ZGZyb250JztcbmltcG9ydCAqIGFzIG9yaWdpbnMgZnJvbSAnYXdzLWNkay1saWIvYXdzLWNsb3VkZnJvbnQtb3JpZ2lucyc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcblxuZXhwb3J0IGludGVyZmFjZSBGZWFkQnVzaW5lc3NBZGRvblN0YWNrUHJvcHMgZXh0ZW5kcyBjZGsuU3RhY2tQcm9wcyB7XG4gIHN0YWdlOiBzdHJpbmc7XG4gIGRvbWFpbjogc3RyaW5nO1xuICBleGlzdGluZ0Rpc3RyaWJ1dGlvbklkOiBzdHJpbmc7XG4gIGxhbmRpbmdCdWNrZXROYW1lOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBGZWFkQnVzaW5lc3NBZGRvblN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgcHVibGljIHJlYWRvbmx5IGJ1Y2tldDogczMuQnVja2V0O1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBGZWFkQnVzaW5lc3NBZGRvblN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IHsgc3RhZ2UsIGRvbWFpbiwgZXhpc3RpbmdEaXN0cmlidXRpb25JZCwgbGFuZGluZ0J1Y2tldE5hbWUgfSA9IHByb3BzO1xuXG4gICAgLy8gQ3JlYXRlIFMzIGJ1Y2tldCBmb3IgYnVzaW5lc3MgYXBwbGljYXRpb25cbiAgICB0aGlzLmJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQodGhpcywgJ0ZlYWRCdXNpbmVzc0J1Y2tldCcsIHtcbiAgICAgIGJ1Y2tldE5hbWU6IGAke3N0YWdlfS0ke2RvbWFpbn0tYnVzaW5lc3NgLFxuICAgICAgd2Vic2l0ZUluZGV4RG9jdW1lbnQ6ICdpbmRleC5odG1sJyxcbiAgICAgIHdlYnNpdGVFcnJvckRvY3VtZW50OiAnaW5kZXguaHRtbCcsIC8vIFNQQSByb3V0aW5nXG4gICAgICBwdWJsaWNSZWFkQWNjZXNzOiBmYWxzZSwgLy8gV2UnbGwgdXNlIE9BQyBpbnN0ZWFkXG4gICAgICBibG9ja1B1YmxpY0FjY2VzczogczMuQmxvY2tQdWJsaWNBY2Nlc3MuQkxPQ0tfQUxMLFxuICAgICAgcmVtb3ZhbFBvbGljeTogc3RhZ2UgPT09ICdwcm9kJyA/IGNkay5SZW1vdmFsUG9saWN5LlJFVEFJTiA6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgICBhdXRvRGVsZXRlT2JqZWN0czogc3RhZ2UgIT09ICdwcm9kJyxcbiAgICB9KTtcblxuICAgIC8vIEltcG9ydCB0aGUgZXhpc3RpbmcgQ2xvdWRGcm9udCBkaXN0cmlidXRpb25cbiAgICBjb25zdCBleGlzdGluZ0Rpc3RyaWJ1dGlvbiA9IGNsb3VkZnJvbnQuRGlzdHJpYnV0aW9uLmZyb21EaXN0cmlidXRpb25BdHRyaWJ1dGVzKFxuICAgICAgdGhpcyxcbiAgICAgICdFeGlzdGluZ0Rpc3RyaWJ1dGlvbicsXG4gICAgICB7XG4gICAgICAgIGRpc3RyaWJ1dGlvbklkOiBleGlzdGluZ0Rpc3RyaWJ1dGlvbklkLFxuICAgICAgICBkb21haW5OYW1lOiBzdGFnZSA9PT0gJ3Byb2QnID8gZG9tYWluIDogYCR7c3RhZ2V9LiR7ZG9tYWlufWAsIC8vIFRoaXMgc2hvdWxkIG1hdGNoIHRoZSBhY3R1YWwgZGlzdHJpYnV0aW9uIGRvbWFpblxuICAgICAgfVxuICAgICk7XG5cbiAgICAvLyBDcmVhdGUgT3JpZ2luIEFjY2VzcyBDb250cm9sIGZvciBidXNpbmVzcyBidWNrZXRcbiAgICBjb25zdCBidXNpbmVzc09hYyA9IG5ldyBjbG91ZGZyb250Lk9yaWdpbkFjY2Vzc0NvbnRyb2wodGhpcywgJ0J1c2luZXNzT0FDJywge1xuICAgICAgZGVzY3JpcHRpb246IGBPQUMgZm9yIGJ1c2luZXNzIGJ1Y2tldCAke3N0YWdlfWAsXG4gICAgICBvcmlnaW5BY2Nlc3NDb250cm9sT3JpZ2luVHlwZTogY2xvdWRmcm9udC5PcmlnaW5BY2Nlc3NDb250cm9sT3JpZ2luVHlwZS5TMyxcbiAgICAgIHNpZ25pbmc6IGNsb3VkZnJvbnQuU2lnbmluZy5TSUdWNF9BTFdBWVMsXG4gICAgfSk7XG5cbiAgICAvLyBHcmFudCBDbG91ZEZyb250IGFjY2VzcyB0byBidXNpbmVzcyBidWNrZXRcbiAgICB0aGlzLmJ1Y2tldC5hZGRUb1Jlc291cmNlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcbiAgICAgIHByaW5jaXBhbHM6IFtuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2Nsb3VkZnJvbnQuYW1hem9uYXdzLmNvbScpXSxcbiAgICAgIGFjdGlvbnM6IFsnczM6R2V0T2JqZWN0J10sXG4gICAgICByZXNvdXJjZXM6IFtgJHt0aGlzLmJ1Y2tldC5idWNrZXRBcm59LypgXSxcbiAgICAgIGNvbmRpdGlvbnM6IHtcbiAgICAgICAgU3RyaW5nRXF1YWxzOiB7XG4gICAgICAgICAgJ0FXUzpTb3VyY2VBcm4nOiBgYXJuOmF3czpjbG91ZGZyb250Ojoke3RoaXMuYWNjb3VudH06ZGlzdHJpYnV0aW9uLyR7ZXhpc3RpbmdEaXN0cmlidXRpb25JZH1gLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KSk7XG5cbiAgICAvLyBXZSBjYW4ndCBkaXJlY3RseSBtb2RpZnkgdGhlIGV4aXN0aW5nIENsb3VkRnJvbnQgZGlzdHJpYnV0aW9uIHRocm91Z2ggQ0RLXG4gICAgLy8gVGhpcyB3aWxsIG5lZWQgdG8gYmUgZG9uZSBtYW51YWxseSBvciB0aHJvdWdoIEFXUyBDTEkvQVBJXG4gICAgLy8gVGhlIGJ1c2luZXNzIGJ1Y2tldCBpcyByZWFkeSBhbmQgaGFzIHRoZSBjb3JyZWN0IHBlcm1pc3Npb25zXG5cbiAgICAvLyBDcmVhdGUgYSBjdXN0b20gcmVzb3VyY2UgdG8gYWRkIHRoZSBiZWhhdmlvclxuICAgIGNvbnN0IHVwZGF0ZURpc3RyaWJ1dGlvbkZ1bmN0aW9uID0gbmV3IGNkay5DdXN0b21SZXNvdXJjZSh0aGlzLCAnVXBkYXRlQ2xvdWRGcm9udERpc3RyaWJ1dGlvbicsIHtcbiAgICAgIHNlcnZpY2VUb2tlbjogdGhpcy5jcmVhdGVVcGRhdGVEaXN0cmlidXRpb25Qcm92aWRlcigpLnNlcnZpY2VUb2tlbixcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgRGlzdHJpYnV0aW9uSWQ6IGV4aXN0aW5nRGlzdHJpYnV0aW9uSWQsXG4gICAgICAgIEJ1c2luZXNzQnVja2V0TmFtZTogdGhpcy5idWNrZXQuYnVja2V0TmFtZSxcbiAgICAgICAgQnVzaW5lc3NPcmlnaW5JZDogYCR7c3RhZ2V9LWJ1c2luZXNzLW9yaWdpbmAsXG4gICAgICAgIE9BQ0lkOiBidXNpbmVzc09hYy5vcmlnaW5BY2Nlc3NDb250cm9sSWQsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gT3V0cHV0c1xuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdCdXNpbmVzc0J1Y2tldE5hbWUnLCB7XG4gICAgICB2YWx1ZTogdGhpcy5idWNrZXQuYnVja2V0TmFtZSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnQnVzaW5lc3MgUzMgQnVja2V0IE5hbWUnLFxuICAgICAgZXhwb3J0TmFtZTogYCR7c3RhZ2V9LWZlYWQtYnVzaW5lc3MtYnVja2V0YCxcbiAgICB9KTtcblxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdFeGlzdGluZ0Rpc3RyaWJ1dGlvbklkJywge1xuICAgICAgdmFsdWU6IGV4aXN0aW5nRGlzdHJpYnV0aW9uSWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ0V4aXN0aW5nIENsb3VkRnJvbnQgRGlzdHJpYnV0aW9uIElEJyxcbiAgICAgIGV4cG9ydE5hbWU6IGAke3N0YWdlfS1mZWFkLWV4aXN0aW5nLWRpc3RyaWJ1dGlvbi1pZGAsXG4gICAgfSk7XG5cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnQnVzaW5lc3NVcmwnLCB7XG4gICAgICB2YWx1ZTogc3RhZ2UgPT09ICdwcm9kJyA/IGBodHRwczovLyR7ZG9tYWlufS9idXNpbmVzc2AgOiBgaHR0cHM6Ly8ke3N0YWdlfS4ke2RvbWFpbn0vYnVzaW5lc3NgLFxuICAgICAgZGVzY3JpcHRpb246ICdCdXNpbmVzcyBBcHAgVVJMJyxcbiAgICAgIGV4cG9ydE5hbWU6IGAke3N0YWdlfS1mZWFkLWJ1c2luZXNzLXVybGAsXG4gICAgfSk7XG5cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnRGVwbG95bWVudEluc3RydWN0aW9ucycsIHtcbiAgICAgIHZhbHVlOiBgVXNlICdhd3MgY2xvdWRmcm9udCBjcmVhdGUtaW52YWxpZGF0aW9uIC0tZGlzdHJpYnV0aW9uLWlkICR7ZXhpc3RpbmdEaXN0cmlidXRpb25JZH0gLS1wYXRocyBcIi9idXNpbmVzcy8qXCInIHRvIGludmFsaWRhdGUgY2FjaGVgLFxuICAgICAgZGVzY3JpcHRpb246ICdDYWNoZSBpbnZhbGlkYXRpb24gY29tbWFuZCBmb3IgYnVzaW5lc3MgYXBwJyxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlVXBkYXRlRGlzdHJpYnV0aW9uUHJvdmlkZXIoKSB7XG4gICAgLy8gVGhpcyB3b3VsZCBjcmVhdGUgYSBMYW1iZGEgZnVuY3Rpb24gdG8gdXBkYXRlIHRoZSBDbG91ZEZyb250IGRpc3RyaWJ1dGlvblxuICAgIC8vIEZvciBub3csIHdlJ2xsIHByb3ZpZGUgbWFudWFsIGluc3RydWN0aW9uc1xuICAgIHJldHVybiBuZXcgY2RrLlByb3ZpZGVyKHRoaXMsICdVcGRhdGVEaXN0cmlidXRpb25Qcm92aWRlcicsIHtcbiAgICAgIG9uRXZlbnRIYW5kbGVyOiBuZXcgY2RrLmF3c19sYW1iZGEuRnVuY3Rpb24odGhpcywgJ1VwZGF0ZURpc3RyaWJ1dGlvbkhhbmRsZXInLCB7XG4gICAgICAgIHJ1bnRpbWU6IGNkay5hd3NfbGFtYmRhLlJ1bnRpbWUuUFlUSE9OXzNfOSxcbiAgICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgICBjb2RlOiBjZGsuYXdzX2xhbWJkYS5Db2RlLmZyb21JbmxpbmUoYFxuaW1wb3J0IGJvdG8zXG5pbXBvcnQganNvblxuXG5kZWYgaGFuZGxlcihldmVudCwgY29udGV4dCk6XG4gICAgIyBUaGlzIHdvdWxkIHVwZGF0ZSB0aGUgQ2xvdWRGcm9udCBkaXN0cmlidXRpb24gdG8gYWRkIHRoZSBidXNpbmVzcyBiZWhhdmlvclxuICAgICMgRm9yIG5vdywgcmV0dXJuIHN1Y2Nlc3MgYW5kIGxldCB1c2VyIGhhbmRsZSBtYW51YWxseVxuICAgIHJldHVybiB7XG4gICAgICAgICdTdGF0dXMnOiAnU1VDQ0VTUycsXG4gICAgICAgICdSZWFzb24nOiAnTWFudWFsIHVwZGF0ZSByZXF1aXJlZCcsXG4gICAgICAgICdQaHlzaWNhbFJlc291cmNlSWQnOiAndXBkYXRlLWRpc3RyaWJ1dGlvbicsXG4gICAgICAgICdEYXRhJzoge31cbiAgICB9XG4gICAgICAgIGApLFxuICAgICAgfSksXG4gICAgfSk7XG4gIH1cbn0iXX0=