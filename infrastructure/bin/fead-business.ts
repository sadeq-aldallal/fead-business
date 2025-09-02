#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { FeadBusinessStack } from '../lib/fead-business-stack';

const app = new cdk.App();

// Get stage from context or default to dev
const stage = app.node.tryGetContext('stage') || 'dev';
const domain = app.node.tryGetContext('domain') || 'fead.app';

// Existing infrastructure details  
const existingDistributionId = app.node.tryGetContext('existingDistributionId') || 'E16J5DW9T69CLY';

new FeadBusinessStack(app, `FeadBusiness${stage.charAt(0).toUpperCase() + stage.slice(1)}Stack`, {
  stage,
  domain,
  existingDistributionId,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

app.synth();