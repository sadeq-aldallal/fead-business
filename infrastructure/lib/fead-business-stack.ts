import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export interface FeadBusinessStackProps extends cdk.StackProps {
  stage: string;
  domain: string;
  existingDistributionId: string;
}

export class FeadBusinessStack extends cdk.Stack {
  public readonly bucket: s3.IBucket;

  constructor(scope: Construct, id: string, props: FeadBusinessStackProps) {
    super(scope, id, props);

    const { stage, domain, existingDistributionId } = props;

    const businessBucketName = `${stage}-${domain}-business`;

    // Import existing business bucket (was previously managed by shared infrastructure)
    // This allows us to take ownership for selective deployments
    this.bucket = s3.Bucket.fromBucketName(this, 'ExistingBusinessBucket', businessBucketName);

    // Grant CloudFront access to business bucket via separate policy
    // Since we're importing the bucket, we need to create the policy as a separate resource
    new s3.BucketPolicy(this, 'BusinessBucketPolicy', {
      bucket: this.bucket,
      policyDocument: new iam.PolicyDocument({
        statements: [
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            principals: [new iam.ServicePrincipal('cloudfront.amazonaws.com')],
            actions: ['s3:GetObject'],
            resources: [`${this.bucket.bucketArn}/*`],
            conditions: {
              StringEquals: {
                'AWS:SourceArn': `arn:aws:cloudfront::${this.account}:distribution/${existingDistributionId}`,
              },
            },
          }),
        ],
      }),
    });

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
  }
}