import { Stage, StageProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { LambdaStack } from "./LambdaStack";

//this is used to call other stack , it extends stages(testing,prod)
export class PipelineStage extends Stage {
  constructor(scope: Construct, id: string, props: StageProps) {
    super(scope, id, props);

    //it sends cicd recive stage to lambda
    new LambdaStack(this, "LambdaStack", {
      stageName: props.stageName,
    });
  }
}
