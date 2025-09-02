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
exports.FeadBusinessSimpleStack = void 0;
const cdk = __importStar(require("aws-cdk-lib"));
const s3 = __importStar(require("aws-cdk-lib/aws-s3"));
const iam = __importStar(require("aws-cdk-lib/aws-iam"));
class FeadBusinessSimpleStack extends cdk.Stack {
    bucket;
    constructor(scope, id, props) {
        super(scope, id, props);
        const { stage, domain, existingDistributionId } = props;
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
        // Grant CloudFront access to business bucket
        // The existing distribution will need to be updated manually to include this bucket as an origin
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
        // Outputs
        new cdk.CfnOutput(this, 'BusinessBucketName', {
            value: this.bucket.bucketName,
            description: 'Business S3 Bucket Name',
            exportName: `${stage}-fead-business-bucket`,
        });
        new cdk.CfnOutput(this, 'BusinessBucketArn', {
            value: this.bucket.bucketArn,
            description: 'Business S3 Bucket ARN',
            exportName: `${stage}-fead-business-bucket-arn`,
        });
        new cdk.CfnOutput(this, 'BusinessBucketDomainName', {
            value: this.bucket.bucketDomainName,
            description: 'Business S3 Bucket Domain Name',
            exportName: `${stage}-fead-business-bucket-domain`,
        });
        new cdk.CfnOutput(this, 'ExistingDistributionId', {
            value: existingDistributionId,
            description: 'Existing CloudFront Distribution ID to update',
            exportName: `${stage}-fead-existing-distribution-id`,
        });
        new cdk.CfnOutput(this, 'BusinessUrl', {
            value: stage === 'prod' ? `https://${domain}/business` : `https://${stage}.${domain}/business`,
            description: 'Business App URL (after CloudFront update)',
            exportName: `${stage}-fead-business-url`,
        });
        new cdk.CfnOutput(this, 'NextSteps', {
            value: `1. Update CloudFront distribution ${existingDistributionId} to add business origin and /business/* behavior. 2. Deploy business app to s3://${this.bucket.bucketName}. 3. Invalidate /business/* paths.`,
            description: 'Manual steps required to complete setup',
        });
    }
}
exports.FeadBusinessSimpleStack = FeadBusinessSimpleStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmVhZC1idXNpbmVzcy1zaW1wbGUtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmZWFkLWJ1c2luZXNzLXNpbXBsZS1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGlEQUFtQztBQUNuQyx1REFBeUM7QUFDekMseURBQTJDO0FBUzNDLE1BQWEsdUJBQXdCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDcEMsTUFBTSxDQUFZO0lBRWxDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBbUM7UUFDM0UsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsc0JBQXNCLEVBQUUsR0FBRyxLQUFLLENBQUM7UUFFeEQsNENBQTRDO1FBQzVDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxvQkFBb0IsRUFBRTtZQUN0RCxVQUFVLEVBQUUsR0FBRyxLQUFLLElBQUksTUFBTSxXQUFXO1lBQ3pDLG9CQUFvQixFQUFFLFlBQVk7WUFDbEMsb0JBQW9CLEVBQUUsWUFBWSxFQUFFLGNBQWM7WUFDbEQsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLHdCQUF3QjtZQUNqRCxpQkFBaUIsRUFBRSxFQUFFLENBQUMsaUJBQWlCLENBQUMsU0FBUztZQUNqRCxhQUFhLEVBQUUsS0FBSyxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTztZQUN0RixpQkFBaUIsRUFBRSxLQUFLLEtBQUssTUFBTTtTQUNwQyxDQUFDLENBQUM7UUFFSCw2Q0FBNkM7UUFDN0MsaUdBQWlHO1FBQ2pHLElBQUksQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO1lBQ3RELE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUs7WUFDeEIsVUFBVSxFQUFFLENBQUMsSUFBSSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsMEJBQTBCLENBQUMsQ0FBQztZQUNsRSxPQUFPLEVBQUUsQ0FBQyxjQUFjLENBQUM7WUFDekIsU0FBUyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsSUFBSSxDQUFDO1lBQ3pDLFVBQVUsRUFBRTtnQkFDVixZQUFZLEVBQUU7b0JBQ1osZUFBZSxFQUFFLHVCQUF1QixJQUFJLENBQUMsT0FBTyxpQkFBaUIsc0JBQXNCLEVBQUU7aUJBQzlGO2FBQ0Y7U0FDRixDQUFDLENBQUMsQ0FBQztRQUVKLFVBQVU7UUFDVixJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLG9CQUFvQixFQUFFO1lBQzVDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVU7WUFDN0IsV0FBVyxFQUFFLHlCQUF5QjtZQUN0QyxVQUFVLEVBQUUsR0FBRyxLQUFLLHVCQUF1QjtTQUM1QyxDQUFDLENBQUM7UUFFSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLG1CQUFtQixFQUFFO1lBQzNDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVM7WUFDNUIsV0FBVyxFQUFFLHdCQUF3QjtZQUNyQyxVQUFVLEVBQUUsR0FBRyxLQUFLLDJCQUEyQjtTQUNoRCxDQUFDLENBQUM7UUFFSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLDBCQUEwQixFQUFFO1lBQ2xELEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQjtZQUNuQyxXQUFXLEVBQUUsZ0NBQWdDO1lBQzdDLFVBQVUsRUFBRSxHQUFHLEtBQUssOEJBQThCO1NBQ25ELENBQUMsQ0FBQztRQUVILElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsd0JBQXdCLEVBQUU7WUFDaEQsS0FBSyxFQUFFLHNCQUFzQjtZQUM3QixXQUFXLEVBQUUsK0NBQStDO1lBQzVELFVBQVUsRUFBRSxHQUFHLEtBQUssZ0NBQWdDO1NBQ3JELENBQUMsQ0FBQztRQUVILElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFO1lBQ3JDLEtBQUssRUFBRSxLQUFLLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQyxXQUFXLE1BQU0sV0FBVyxDQUFDLENBQUMsQ0FBQyxXQUFXLEtBQUssSUFBSSxNQUFNLFdBQVc7WUFDOUYsV0FBVyxFQUFFLDRDQUE0QztZQUN6RCxVQUFVLEVBQUUsR0FBRyxLQUFLLG9CQUFvQjtTQUN6QyxDQUFDLENBQUM7UUFFSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRTtZQUNuQyxLQUFLLEVBQUUscUNBQXFDLHNCQUFzQixvRkFBb0YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLG9DQUFvQztZQUNoTixXQUFXLEVBQUUseUNBQXlDO1NBQ3ZELENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQXJFRCwwREFxRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEZlYWRCdXNpbmVzc1NpbXBsZVN0YWNrUHJvcHMgZXh0ZW5kcyBjZGsuU3RhY2tQcm9wcyB7XG4gIHN0YWdlOiBzdHJpbmc7XG4gIGRvbWFpbjogc3RyaW5nO1xuICBleGlzdGluZ0Rpc3RyaWJ1dGlvbklkOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBGZWFkQnVzaW5lc3NTaW1wbGVTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIHB1YmxpYyByZWFkb25seSBidWNrZXQ6IHMzLkJ1Y2tldDtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogRmVhZEJ1c2luZXNzU2ltcGxlU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3QgeyBzdGFnZSwgZG9tYWluLCBleGlzdGluZ0Rpc3RyaWJ1dGlvbklkIH0gPSBwcm9wcztcblxuICAgIC8vIENyZWF0ZSBTMyBidWNrZXQgZm9yIGJ1c2luZXNzIGFwcGxpY2F0aW9uXG4gICAgdGhpcy5idWNrZXQgPSBuZXcgczMuQnVja2V0KHRoaXMsICdGZWFkQnVzaW5lc3NCdWNrZXQnLCB7XG4gICAgICBidWNrZXROYW1lOiBgJHtzdGFnZX0tJHtkb21haW59LWJ1c2luZXNzYCxcbiAgICAgIHdlYnNpdGVJbmRleERvY3VtZW50OiAnaW5kZXguaHRtbCcsXG4gICAgICB3ZWJzaXRlRXJyb3JEb2N1bWVudDogJ2luZGV4Lmh0bWwnLCAvLyBTUEEgcm91dGluZ1xuICAgICAgcHVibGljUmVhZEFjY2VzczogZmFsc2UsIC8vIFdlJ2xsIHVzZSBPQUMgaW5zdGVhZFxuICAgICAgYmxvY2tQdWJsaWNBY2Nlc3M6IHMzLkJsb2NrUHVibGljQWNjZXNzLkJMT0NLX0FMTCxcbiAgICAgIHJlbW92YWxQb2xpY3k6IHN0YWdlID09PSAncHJvZCcgPyBjZGsuUmVtb3ZhbFBvbGljeS5SRVRBSU4gOiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgICAgYXV0b0RlbGV0ZU9iamVjdHM6IHN0YWdlICE9PSAncHJvZCcsXG4gICAgfSk7XG5cbiAgICAvLyBHcmFudCBDbG91ZEZyb250IGFjY2VzcyB0byBidXNpbmVzcyBidWNrZXRcbiAgICAvLyBUaGUgZXhpc3RpbmcgZGlzdHJpYnV0aW9uIHdpbGwgbmVlZCB0byBiZSB1cGRhdGVkIG1hbnVhbGx5IHRvIGluY2x1ZGUgdGhpcyBidWNrZXQgYXMgYW4gb3JpZ2luXG4gICAgdGhpcy5idWNrZXQuYWRkVG9SZXNvdXJjZVBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXG4gICAgICBwcmluY2lwYWxzOiBbbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdjbG91ZGZyb250LmFtYXpvbmF3cy5jb20nKV0sXG4gICAgICBhY3Rpb25zOiBbJ3MzOkdldE9iamVjdCddLFxuICAgICAgcmVzb3VyY2VzOiBbYCR7dGhpcy5idWNrZXQuYnVja2V0QXJufS8qYF0sXG4gICAgICBjb25kaXRpb25zOiB7XG4gICAgICAgIFN0cmluZ0VxdWFsczoge1xuICAgICAgICAgICdBV1M6U291cmNlQXJuJzogYGFybjphd3M6Y2xvdWRmcm9udDo6JHt0aGlzLmFjY291bnR9OmRpc3RyaWJ1dGlvbi8ke2V4aXN0aW5nRGlzdHJpYnV0aW9uSWR9YCxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSkpO1xuXG4gICAgLy8gT3V0cHV0c1xuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdCdXNpbmVzc0J1Y2tldE5hbWUnLCB7XG4gICAgICB2YWx1ZTogdGhpcy5idWNrZXQuYnVja2V0TmFtZSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnQnVzaW5lc3MgUzMgQnVja2V0IE5hbWUnLFxuICAgICAgZXhwb3J0TmFtZTogYCR7c3RhZ2V9LWZlYWQtYnVzaW5lc3MtYnVja2V0YCxcbiAgICB9KTtcblxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdCdXNpbmVzc0J1Y2tldEFybicsIHtcbiAgICAgIHZhbHVlOiB0aGlzLmJ1Y2tldC5idWNrZXRBcm4sXG4gICAgICBkZXNjcmlwdGlvbjogJ0J1c2luZXNzIFMzIEJ1Y2tldCBBUk4nLFxuICAgICAgZXhwb3J0TmFtZTogYCR7c3RhZ2V9LWZlYWQtYnVzaW5lc3MtYnVja2V0LWFybmAsXG4gICAgfSk7XG5cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnQnVzaW5lc3NCdWNrZXREb21haW5OYW1lJywge1xuICAgICAgdmFsdWU6IHRoaXMuYnVja2V0LmJ1Y2tldERvbWFpbk5hbWUsXG4gICAgICBkZXNjcmlwdGlvbjogJ0J1c2luZXNzIFMzIEJ1Y2tldCBEb21haW4gTmFtZScsXG4gICAgICBleHBvcnROYW1lOiBgJHtzdGFnZX0tZmVhZC1idXNpbmVzcy1idWNrZXQtZG9tYWluYCxcbiAgICB9KTtcblxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdFeGlzdGluZ0Rpc3RyaWJ1dGlvbklkJywge1xuICAgICAgdmFsdWU6IGV4aXN0aW5nRGlzdHJpYnV0aW9uSWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ0V4aXN0aW5nIENsb3VkRnJvbnQgRGlzdHJpYnV0aW9uIElEIHRvIHVwZGF0ZScsXG4gICAgICBleHBvcnROYW1lOiBgJHtzdGFnZX0tZmVhZC1leGlzdGluZy1kaXN0cmlidXRpb24taWRgLFxuICAgIH0pO1xuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ0J1c2luZXNzVXJsJywge1xuICAgICAgdmFsdWU6IHN0YWdlID09PSAncHJvZCcgPyBgaHR0cHM6Ly8ke2RvbWFpbn0vYnVzaW5lc3NgIDogYGh0dHBzOi8vJHtzdGFnZX0uJHtkb21haW59L2J1c2luZXNzYCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnQnVzaW5lc3MgQXBwIFVSTCAoYWZ0ZXIgQ2xvdWRGcm9udCB1cGRhdGUpJyxcbiAgICAgIGV4cG9ydE5hbWU6IGAke3N0YWdlfS1mZWFkLWJ1c2luZXNzLXVybGAsXG4gICAgfSk7XG5cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnTmV4dFN0ZXBzJywge1xuICAgICAgdmFsdWU6IGAxLiBVcGRhdGUgQ2xvdWRGcm9udCBkaXN0cmlidXRpb24gJHtleGlzdGluZ0Rpc3RyaWJ1dGlvbklkfSB0byBhZGQgYnVzaW5lc3Mgb3JpZ2luIGFuZCAvYnVzaW5lc3MvKiBiZWhhdmlvci4gMi4gRGVwbG95IGJ1c2luZXNzIGFwcCB0byBzMzovLyR7dGhpcy5idWNrZXQuYnVja2V0TmFtZX0uIDMuIEludmFsaWRhdGUgL2J1c2luZXNzLyogcGF0aHMuYCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnTWFudWFsIHN0ZXBzIHJlcXVpcmVkIHRvIGNvbXBsZXRlIHNldHVwJyxcbiAgICB9KTtcbiAgfVxufSJdfQ==