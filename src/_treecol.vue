<template>
<g class="tree-col">
    <g v-for="bkt in buckets" class="bucket" :class="{'active': $index == selected}" :transform="translate(0, y_pos($index))"
        @click.prevent="select($index)" @mouseenter="show_tooltip(bkt_tooltip(bkt), $event)" @mouseleave="hide_tooltip($event)">
        <rect :height="bkt_height($index)" class="bucket-item" :width="width" rx="3" ry="3"></rect>
        <g class="bucket-item-text" :class="{'outer': is_text_outer($index)}">
            <text class="bucket-item-text header" :dy="bkt_txt_y_pos($index)" :x="width / 2">
                {{ bkt.key }}
            </text>
            <text class="bucket-item-text val" :dy="bkt_txt_y_pos($index) + line_height" :x="width / 2">
                {{ bkt_val_label(bkt) }}
            </text>
        </g>
    </g>
</g>
</template>

<script>

import YPosApi from './_yposapi'

export default {
    props: {
        width: {
            type: Number,
            default: 50
        },
        height: {
            type: Number,
            default: 400
        },
        buckets: {
            type: Array,
        },
        selected: {
            type: Number,
            default: 0
        },
        level: {  // 上层处理select事件时需要
            type: Number,
            default: 0
        }
    },
    methods: {
        y_pos: function(index) {
            return this.ypos_api.getYPos(index);
        },
        bkt_height: function(index) {
            return this.ypos_api.getHeight(index);
        },
        bkt_val_label: function(bkt) {
            var percent = Math.round(bkt.data.ratio * 100 * 10) / 10;
            return '' + bkt.data.value + ' ' + '(' + percent + '%)';
        },
        translate: function(x, y) {
            return 'translate(' + x + ',' + y + ')';
        },
        bkt_txt_y_pos: function(index) {
            return this.ypos_api.getTextPos(index);
        },
        select: function(index) {
            this.selected = index;
            this.$emit('select', this.selected, this.level);
        },
        bkt_tooltip: function(bkt) {
            return '<div class="bucket-tooltip">' + bkt.key + '<br/>' + this.bkt_val_label(bkt) + '</div>';
        },
        show_tooltip: function(div, event) {
            this.$emit('show-tooltip', div, event);
        },
        hide_tooltip: function(event) {
            this.$emit('hide-tooltip', event);
        },
        is_text_outer: function(index) {
            return this.ypos_api.isTextOuter(index);
        }
    },
    computed: {
        ypos_api: function() {
            return new YPosApi(this.buckets, this.height);
        },
        line_height: function() {
            return this.ypos_api.text_height + this.ypos_api.text_padding;
        }
    }
}
</script>

<style>

.bucket-item {
    fill: white;
    stroke:#aaa;
}

.bucket-container {
  fill: #aaa;
}

.active .bucket-item{
  stroke:rgba(38,166,154,1);
  fill:rgba(38,166,154,1);
}

.bucket-item:hover {
  stroke:rgba(38,166,154,1);
  opacity: 0.9;
  cursor:pointer;
}

.active .bucket-item:hover {
  opacity: 0.9;
}

.bucket-item-text {
  font: 16px;
  text-anchor: middle;
  fill: #333;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.active .bucket-item-text {
  fill: #fff;
}

.bucket-item-text.val {
  fill: #999;
  font-size:12px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.active .bucket-item-text.val {
  fill: rgba(255,255,255,.7)
}

.active .outer .header {
  fill: rgba(38,166,154,1);
  
}
.active .outer .val {
  fill: rgba(38,166,154,.5)
}


</style>
