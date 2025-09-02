import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export interface FeadBusinessSimpleStackProps extends cdk.StackProps {
  stage: string;
  domain: string;
  existingDistributionId: string;
}

export class FeadBusinessSimpleStack extends cdk.Stack {
  public readonly bucket: s3.Bucket;

  constructor(scope: Construct, id: string, props: FeadBusinessSimpleStackProps) {
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