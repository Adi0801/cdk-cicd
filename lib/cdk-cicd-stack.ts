import * as cdk from "aws-cdk-lib";

import {
  CodeBuildStep,
  CodePipeline,
  CodePipelineSource,
  ShellStep,
} from "aws-cdk-lib/pipelines";
import { Construct } from "constructs";
import { PipelineStage } from "./PipelineStage";

export class CdkCicdStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //creating cicd pipeline
    const pipeline = new CodePipeline(this, "AwesomePipeline", {
      pipelineName: "AwesomePipeline",
      synth: new ShellStep("Synth", {
        input: CodePipelineSource.gitHub("Adi0801/cdk-cicd", "master"),

        commands: [
          "mkdir -p /root/.cdk/cache", // Create the missing directory
          "touch /root/.cdk/cache/notices.json",
          "npm ci", // <-- Add a comma here
          "npx cdk synth",
        ],
      }),
      selfMutation: false,
    });

    //this will add stage to the pipeline ,the stage will be reult from pipeline stage
    const testStage = pipeline.addStage(
      new PipelineStage(this, "PipelineTestStage", {
        stageName: "test",
      })
    );

    //this addded to deploy test
    testStage.addPre(
      new CodeBuildStep("unit-tests", {
        commands: ["npm ci", "npm test"],
      })
    );
  }
}
