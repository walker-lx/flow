import { GroupNode } from '@logicflow/extension';

class WhenGroup extends GroupNode.view {
}
class WhenGroupModel extends GroupNode.model {
  getNodeStyle() {
    const style = super.getNodeStyle();
    style.stroke = '#AEAFAE';
    style.strokeDasharray = '3 3';
    style.strokeWidth = 1;
    return style;
  }
  initNodeData(data:any) {
    super.initNodeData(data);
    this.isRestrict = true;
    this.resizable = true;
    this.foldable = true;
    this.width = 500;
    this.height = 300;
    this.foldedWidth = 50;
    this.foldedHeight = 50;
    this.setProperties({
        nodeType: 'WHEN'
      });
  }

}

export default {
  type: "WhenGroupNode",
  view: WhenGroup,
  model: WhenGroupModel
};
