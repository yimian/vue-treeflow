<template>
<g class="tree-col">
    <rect :height="height" :width="width" class="bucket-container"></rect>
    <g v-for="bkt in buckets" class="bucket" :transform="translate(line_width, y_pos($index))"
        @click.prevent="select($index)" data-toggle="tooltip" data-placement="right" :title="bkt_tooltip(bkt)">
        <rect :height="bkt_height($index)" class="bucket-item" :class="{'active': $index == selected}"
            :width="width - 2 * line_width"></rect>
        <g class="bucket-item-text" v-if="bkt_height($index) >= min_txt_height" data-toggle="tooltip" >
            <text class="bucket-item-text header" :dy="bkt_txt_y_pos(bkt_height($index))" :x="width / 2">
                {{ bkt.key }}
            </text>
            <text class="bucket-item-text val" :dy="bkt_txt_y_pos(bkt_height($index)) + 26" :x="width / 2">
                {{ bkt_val_label(bkt) }}
            </text>
        </g>
    </g>
</g>
</template>

<script>

require('bootstrap/js/tooltip')

export default {
    data: function() {
        return {
            line_width: 1,
            text_height: 16,
            min_text_padding: 10
        }
    },
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
            var ratio = 0;
            for(var i = 0; i < index; i++) {
                ratio += this.buckets[i].data.ratio;
            }
            return ratio * this.inner_height + this.line_width * (index + 1);
        },
        bkt_height: function(index) {
            return this.inner_height * this.buckets[index].data.ratio;
        },
        bkt_val_label: function(bkt) {
            var percent = Math.round(bkt.data.ratio * 100 * 10) / 10;
            return '' + bkt.data.value + ' ' + '(' + percent + '%)';
        },
        translate: function(x, y) {
            return 'translate(' + x + ',' + y + ')';
        },
        bkt_txt_y_pos: function(height) {
            return height / 2 - this.min_text_padding / 2 - this.text_height;
        },
        select: function(index) {
            this.selected = index;
            this.$emit('select', this.selected, this.level);
        },
        bkt_tooltip: function(bkt) {
            return '<div class="bucket-tooltip">' + bkt.key + '<br/>' + this.bkt_val_label(bkt) + '</div>';
        }
    },
    computed: {
        min_txt_height: function() {
            return 2 * this.min_text_padding + this.text_height * 2 + this.min_text_padding;
        },
        inner_height: function() {
            return this.height - this.line_width * (this.buckets.length + 1);
        }
    },
    watch: {
        buckets: function() {
            // 处理tooltips
            $('[data-toggle="tooltip"]').tooltip({container: 'body', html: true});
        }
    },
    ready: function() {
        $(function() {
            // TODO：自己实现tooltip功能
            $('[data-toggle="tooltip"]').tooltip({container: 'body', html: true});
        });
    }
}
</script>

<style>

.bucket-item {
    fill: white;
}

.bucket-container {
}

.bucket-item.active {
  stroke: rgb(253, 152, 39);
  stroke-width: 2;
}

.bucket-item:hover {
  stroke-dasharray: 5,5;
  stroke: #000;
  stroke-width: 2;
}

.bucket-item.active:hover {
  stroke: rgb(253, 152, 39);
  stroke-width: 2;
  stroke-dasharray: 5,5;
}

.bucket-item-text {
  font: 16px sans-serif;
  text-anchor: middle;
}

.bucket-item-text.val {
  fill: blue;
}

</style>
