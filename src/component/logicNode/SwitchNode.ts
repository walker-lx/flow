import { DiamondNode, DiamondNodeModel,h } from "@logicflow/core";
import { IdUtil } from "@/ts/IdUtil";
class SwitchNodeModel extends DiamondNodeModel {

  initNodeData(data: any): void {
    super.initNodeData(data);
    this.setProperties({
      nodeType: 'SWITCH',
      conditionNodeId: IdUtil.makeString()
    });
  }

  getNodeStyle() {
  	const style = super.getNodeStyle();
  	style.stroke = 'red';
  	return style;
	}

}

  class SwitchNodeView extends DiamondNode {
   
  }

export default {
  type: "SwitchNode",
  view: SwitchNodeView,
  model: SwitchNodeModel
};