<template>
    <div>
        <button @click="getData">获取数据test</button>
        <button @click="openLoadDataInput">加载数据</button>
        <div v-if ="showLoadDataInput">

            <textarea v-model="loadedData" rows="10" cols="40"></textarea>
            <button @click="loadData">确认</button>
            <button @click="closeLoadDataInput">关闭</button>
        </div>
    </div>
    <div ref="container" class="container">

    </div>
</template>
<script setup lang="ts" >
import { ref,reactive, onMounted } from 'vue'
//logicflow 核心
import LogicFlow from "@logicflow/core";
import "@logicflow/core/dist/style/index.css";
//拖拽面板
import { DndPanel, SelectionSelect } from '@logicflow/extension';
import '@logicflow/extension/lib/style/index.css'
//控制面板 Control
import { Control } from '@logicflow/extension';
//小地图
import { MiniMap } from '@logicflow/extension';
//菜单
import { Menu } from '@logicflow/extension';
//分组
import { Group } from '@logicflow/extension';

//自定义节点
import CommonNode from "../component/logicNode/CommonNode"
import LockedNode from "../component/logicNode/LockedNode"
import SwitchNode from "../component/logicNode/SwitchNode"
import IfNode from "../component/logicNode/IfNode"
import WhenGroupNode from "../component/logicNode/WhenGroupNode"

LogicFlow.use(Control);
LogicFlow.use(MiniMap);
LogicFlow.use(Menu);
LogicFlow.use(SelectionSelect);

const showLoadDataInput = ref(false)
const loadedData = ref('')


// 声明容器的对应ref对象和LF对象
const container = ref();
const lf = ref<LogicFlow>();

//拖拽面板
const patternItems = [

    {
        type: 'CommonNode',
        text: '普通',
        label: '普通组件',
        icon: 'data:image/png;base64,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',
    },
    {
        type: 'SwitchNode',
        text: '选择',
        label: '选择组件',
        icon: 'data:image/png;base64,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',
    },
    {
        type: 'IfNode',
        text: '判断',
        label: '判断组件',
        icon: 'data:image/png;base64,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',
    },
    {
        type: 'WhenGroupNode',
        text: '',
        label: '并行分组',
        icon: 'data:image/png;base64,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',

    }
]

//流程图数据
const data = reactive<any>({});
data.value={"nodes":[{"id":"37068e44-b7f8-4d43-a379-b294842cc35f","type":"CommonNode","x":360,"y":260,"properties":{"nodeType":"COMMON","nodeId":"id1"},"text":{"x":360,"y":260,"value":"id1"}},{"id":"248a88cf-445d-4938-b6e6-2fa42975e572","type":"CommonNode","x":600,"y":140,"properties":{"nodeType":"COMMON","nodeId":"id2"},"text":{"x":600,"y":140,"value":"id2"}},{"id":"8fe456c3-34dd-46f3-bd07-2f733d1e5c37","type":"CommonNode","x":660,"y":320,"properties":{"nodeType":"COMMON","nodeId":"id3"},"text":{"x":660,"y":320,"value":"id3"}},{"id":"1eda6434-fa6d-40dc-a725-57d44bdadea8","type":"CommonNode","x":1140,"y":160,"properties":{"nodeType":"COMMON","nodeId":"id4"},"text":{"x":1140,"y":160,"value":"id4"}},{"id":"0e5feb52-da0d-4121-a3fd-4ef72281280c","type":"CommonNode","x":900,"y":380,"properties":{"nodeType":"COMMON","nodeId":"id5"},"text":{"x":900,"y":380,"value":"id5"}},{"id":"bcc07763-9d31-4c8e-a260-cdb443667215","type":"CommonNode","x":900,"y":260,"properties":{"nodeType":"COMMON","nodeId":"id6"},"text":{"x":900,"y":260,"value":"id6"}},{"id":"80128100-68af-43a7-8815-a9b5b75814df","type":"WhenGroupNode","x":760,"y":300,"properties":{"nodeSize":{"width":544,"height":420},"nodeType":"WHEN"},"children":["248a88cf-445d-4938-b6e6-2fa42975e572","8fe456c3-34dd-46f3-bd07-2f733d1e5c37","846b5512-3861-4a9d-811d-4ab456d0abc5"]},{"id":"846b5512-3861-4a9d-811d-4ab456d0abc5","type":"WhenGroupNode","x":900,"y":340,"properties":{"nodeSize":{"width":214,"height":257},"nodeType":"WHEN"},"children":["0e5feb52-da0d-4121-a3fd-4ef72281280c","bcc07763-9d31-4c8e-a260-cdb443667215"]}],"edges":[{"id":"2b4b05d6-0836-4275-b99a-276d54a71dfa","type":"polyline","sourceNodeId":"37068e44-b7f8-4d43-a379-b294842cc35f","targetNodeId":"248a88cf-445d-4938-b6e6-2fa42975e572","startPoint":{"x":420,"y":260},"endPoint":{"x":540,"y":140},"properties":{},"pointsList":[{"x":420,"y":260},{"x":510,"y":260},{"x":510,"y":140},{"x":540,"y":140}]},{"id":"5bfc56ee-0f9e-4867-8f23-466052667a84","type":"polyline","sourceNodeId":"37068e44-b7f8-4d43-a379-b294842cc35f","targetNodeId":"8fe456c3-34dd-46f3-bd07-2f733d1e5c37","startPoint":{"x":420,"y":260},"endPoint":{"x":600,"y":320},"properties":{},"pointsList":[{"x":420,"y":260},{"x":510,"y":260},{"x":510,"y":320},{"x":600,"y":320}]},{"id":"fcc45eb3-ae34-4ce8-aed1-d5aab974292e","type":"polyline","sourceNodeId":"248a88cf-445d-4938-b6e6-2fa42975e572","targetNodeId":"1eda6434-fa6d-40dc-a725-57d44bdadea8","startPoint":{"x":660,"y":140},"endPoint":{"x":1080,"y":160},"properties":{},"pointsList":[{"x":660,"y":140},{"x":870,"y":140},{"x":870,"y":160},{"x":1080,"y":160}]},{"id":"162a655f-5137-458a-b4c7-6aeeb046c78d","type":"polyline","sourceNodeId":"8fe456c3-34dd-46f3-bd07-2f733d1e5c37","targetNodeId":"0e5feb52-da0d-4121-a3fd-4ef72281280c","startPoint":{"x":720,"y":320},"endPoint":{"x":840,"y":380},"properties":{},"pointsList":[{"x":720,"y":320},{"x":780,"y":320},{"x":780,"y":380},{"x":840,"y":380}]},{"id":"070868b0-8fb5-46ff-9f95-bdf132f420a4","type":"polyline","sourceNodeId":"8fe456c3-34dd-46f3-bd07-2f733d1e5c37","targetNodeId":"bcc07763-9d31-4c8e-a260-cdb443667215","startPoint":{"x":720,"y":320},"endPoint":{"x":840,"y":260},"properties":{},"pointsList":[{"x":720,"y":320},{"x":780,"y":320},{"x":780,"y":260},{"x":840,"y":260}]},{"id":"5c3a01c0-3811-492d-ba65-2045e60d52ce","type":"polyline","sourceNodeId":"bcc07763-9d31-4c8e-a260-cdb443667215","targetNodeId":"1eda6434-fa6d-40dc-a725-57d44bdadea8","startPoint":{"x":960,"y":260},"endPoint":{"x":1080,"y":160},"properties":{},"pointsList":[{"x":960,"y":260},{"x":1050,"y":260},{"x":1050,"y":160},{"x":1080,"y":160}]},{"id":"ad16b375-8e9b-45f6-b3d7-e45ba8a1a919","type":"polyline","sourceNodeId":"0e5feb52-da0d-4121-a3fd-4ef72281280c","targetNodeId":"1eda6434-fa6d-40dc-a725-57d44bdadea8","startPoint":{"x":960,"y":380},"endPoint":{"x":1080,"y":160},"properties":{},"pointsList":[{"x":960,"y":380},{"x":1050,"y":380},{"x":1050,"y":160},{"x":1080,"y":160}]}]}

const getData = ()=>{
    console.log(JSON.stringify( lf.value?.getGraphRawData()))
}

const openLoadDataInput = ()=>{
    showLoadDataInput.value = true
}
const closeLoadDataInput = ()=>{
    showLoadDataInput.value = false
}

const loadData = () =>{
    let a = JSON.parse(loadedData.value)
    console.log(a)
    lf.value?.render(a)
}

onMounted(() => {

    lf.value = new LogicFlow({
        // 通过选项指定了渲染的容器和需要显示网格
        container: container.value,
        grid: true,
        plugins: [DndPanel, SelectionSelect, Control, MiniMap, Menu,   Group]
    })

    //注册自定义节点
    lf.value.register(CommonNode)
    lf.value.register(LockedNode)
    lf.value.register(SwitchNode)
    lf.value.register(IfNode)
    lf.value.register(WhenGroupNode)


    //拖拽面板
    lf.value.extension.dndPanel.setPatternItems(patternItems);
    lf.value.extension.control.addItem({
        iconClass: "custom-minimap",
        title: "",
        text: "导航",
        onMouseEnter: (tathLf: LogicFlow, ev: MouseEvent) => {
            const position = tathLf.getPointByClient(ev.x, ev.y);
            tathLf.extension.miniMap.showMiniMap.show(
                position.domOverlayPosition.x - 120,
                position.domOverlayPosition.y + 35
            );
        },
        onClick: (tathLf: LogicFlow, ev: MouseEvent) => {
            const position = tathLf.getPointByClient(ev.x, ev.y);
            tathLf.extension.miniMap.show(
                position.domOverlayPosition.x - 120,
                position.domOverlayPosition.y + 35
            );
        }
    });
    // 为菜单追加选项
    lf.value.extension.menu.addMenuConfig({
        nodeMenu: [
            {
                text: '分享',
                callback() {
                    alert('分享成功！');
                }
            },
            {
                text: '属性',
                callback(node: any) {
                    alert(`
          节点id：${node.id}
          节点类型：${node.type}
          节点坐标：(x: ${node.x}, y: ${node.y})`
                    );
                },
            },
        ],
        edgeMenu: [
            {
                text: '属性',
                callback(edge: any) {
                    alert(`
          边id：${edge.id}
          边类型：${edge.type}
          边坐标：(x: ${edge.x}, y: ${edge.y})
          源节点id：${edge.sourceNodeId}
          目标节点id：${edge.targetNodeId}`
                    );
                },
            },
        ],
        graphMenu: [
            {
                text: '分享',
                callback() {
                    alert('分享成功！');
                }
            },
        ],
    });
    //开启框选
    lf.value.extension.selectionSelect.openSelectionSelect();



    lf.value.render(data.value);
})

</script>
<style>
.container {
    width: 1600px;
    height: 2000px;
}
</style>