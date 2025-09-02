import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { Construct } from 'constructs';
export interface FeadBusinessStackProps extends cdk.StackProps {
    stage: string;
    domain: string;
    certificateArn: string;
    existingDistributionId?: string;
    landingBucketName: string;
}
export declare class FeadBusinessStack extends cdk.Stack {
    readonly bucket: s3.Bucket;
    readonly distribution: cloudfront.Distribution;
    constructor(scope: Construct, id: string, props: FeadBusinessStackProps);
}
