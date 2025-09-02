import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
export interface FeadBusinessSimpleStackProps extends cdk.StackProps {
    stage: string;
    domain: string;
    existingDistributionId: string;
}
export declare class FeadBusinessSimpleStack extends cdk.Stack {
    readonly bucket: s3.Bucket;
    constructor(scope: Construct, id: string, props: FeadBusinessSimpleStackProps);
}
