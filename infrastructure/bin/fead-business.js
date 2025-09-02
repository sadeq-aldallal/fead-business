#!/usr/bin/env node
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
require("source-map-support/register");
const cdk = __importStar(require("aws-cdk-lib"));
const fead_business_stack_1 = require("../lib/fead-business-stack");
const app = new cdk.App();
// Get stage from context or default to dev
const stage = app.node.tryGetContext('stage') || 'dev';
const domain = app.node.tryGetContext('domain') || 'fead.app';
// Certificate ARN
const certificateArn = app.node.tryGetContext('certificateArn') ||
    'arn:aws:acm:us-east-1:742054800137:certificate/6895f54c-66c5-4286-bad6-e8aa0141040a';
// Existing infrastructure details  
const existingDistributionId = app.node.tryGetContext('existingDistributionId') || 'E3FT5O6TL4MEXM';
const landingBucketName = app.node.tryGetContext('landingBucketName') || `${stage}-${domain}-landing`;
new fead_business_stack_1.FeadBusinessStack(app, `FeadBusiness${stage.charAt(0).toUpperCase() + stage.slice(1)}Stack`, {
    stage,
    domain,
    certificateArn,
    existingDistributionId,
    landingBucketName,
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
    },
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmVhZC1idXNpbmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZlYWQtYnVzaW5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSx1Q0FBcUM7QUFDckMsaURBQW1DO0FBQ25DLG9FQUErRDtBQUUvRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQiwyQ0FBMkM7QUFDM0MsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxDQUFDO0FBQ3ZELE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxJQUFJLFVBQVUsQ0FBQztBQUU5RCxrQkFBa0I7QUFDbEIsTUFBTSxjQUFjLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUM7SUFDN0QscUZBQXFGLENBQUM7QUFFeEYsb0NBQW9DO0FBQ3BDLE1BQU0sc0JBQXNCLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsd0JBQXdCLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQztBQUNwRyxNQUFNLGlCQUFpQixHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFDLElBQUksR0FBRyxLQUFLLElBQUksTUFBTSxVQUFVLENBQUM7QUFFdEcsSUFBSSx1Q0FBaUIsQ0FBQyxHQUFHLEVBQUUsZUFBZSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRTtJQUMvRixLQUFLO0lBQ0wsTUFBTTtJQUNOLGNBQWM7SUFDZCxzQkFBc0I7SUFDdEIsaUJBQWlCO0lBQ2pCLEdBQUcsRUFBRTtRQUNILE9BQU8sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQjtRQUN4QyxNQUFNLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0I7S0FDdkM7Q0FDRixDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG5pbXBvcnQgJ3NvdXJjZS1tYXAtc3VwcG9ydC9yZWdpc3Rlcic7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgRmVhZEJ1c2luZXNzU3RhY2sgfSBmcm9tICcuLi9saWIvZmVhZC1idXNpbmVzcy1zdGFjayc7XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbi8vIEdldCBzdGFnZSBmcm9tIGNvbnRleHQgb3IgZGVmYXVsdCB0byBkZXZcbmNvbnN0IHN0YWdlID0gYXBwLm5vZGUudHJ5R2V0Q29udGV4dCgnc3RhZ2UnKSB8fCAnZGV2JztcbmNvbnN0IGRvbWFpbiA9IGFwcC5ub2RlLnRyeUdldENvbnRleHQoJ2RvbWFpbicpIHx8ICdmZWFkLmFwcCc7XG5cbi8vIENlcnRpZmljYXRlIEFSTlxuY29uc3QgY2VydGlmaWNhdGVBcm4gPSBhcHAubm9kZS50cnlHZXRDb250ZXh0KCdjZXJ0aWZpY2F0ZUFybicpIHx8IFxuICAnYXJuOmF3czphY206dXMtZWFzdC0xOjc0MjA1NDgwMDEzNzpjZXJ0aWZpY2F0ZS82ODk1ZjU0Yy02NmM1LTQyODYtYmFkNi1lOGFhMDE0MTA0MGEnO1xuXG4vLyBFeGlzdGluZyBpbmZyYXN0cnVjdHVyZSBkZXRhaWxzICBcbmNvbnN0IGV4aXN0aW5nRGlzdHJpYnV0aW9uSWQgPSBhcHAubm9kZS50cnlHZXRDb250ZXh0KCdleGlzdGluZ0Rpc3RyaWJ1dGlvbklkJykgfHwgJ0UzRlQ1TzZUTDRNRVhNJztcbmNvbnN0IGxhbmRpbmdCdWNrZXROYW1lID0gYXBwLm5vZGUudHJ5R2V0Q29udGV4dCgnbGFuZGluZ0J1Y2tldE5hbWUnKSB8fCBgJHtzdGFnZX0tJHtkb21haW59LWxhbmRpbmdgO1xuXG5uZXcgRmVhZEJ1c2luZXNzU3RhY2soYXBwLCBgRmVhZEJ1c2luZXNzJHtzdGFnZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0YWdlLnNsaWNlKDEpfVN0YWNrYCwge1xuICBzdGFnZSxcbiAgZG9tYWluLFxuICBjZXJ0aWZpY2F0ZUFybixcbiAgZXhpc3RpbmdEaXN0cmlidXRpb25JZCxcbiAgbGFuZGluZ0J1Y2tldE5hbWUsXG4gIGVudjoge1xuICAgIGFjY291bnQ6IHByb2Nlc3MuZW52LkNES19ERUZBVUxUX0FDQ09VTlQsXG4gICAgcmVnaW9uOiBwcm9jZXNzLmVudi5DREtfREVGQVVMVF9SRUdJT04sXG4gIH0sXG59KTtcblxuYXBwLnN5bnRoKCk7Il19