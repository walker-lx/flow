import { DiamondNode, DiamondNodeModel,h } from "@logicflow/core";

class SwitchNodeModel extends DiamondNodeModel {

  initNodeData(data: any): void {
    super.initNodeData(data);
    this.setProperties({
      nodeType: 'SWITCH',
      conditionNodeId:'cid'
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