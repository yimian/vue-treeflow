<template>
<g class="tree-col">
    <rect :height="height" :width="width" class="bucket-container"></rect>
    <g v-for="bkt in buckets" class="bucket" :class="{'active': $index == selected}" :transform="translate(line_width, y_pos($index))"
        @click.prevent="select($index)" @mouseenter="show_tooltip(bkt_tooltip(bkt), $event)" @mouseleave="hide_tooltip($event)">
        <rect :height="bkt_height($index)" class="bucket-item"
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
        },
        show_tooltip: function(div, event) {
            this.$emit('show-tooltip', div, event);
        },
        hide_tooltip: function(event) {
            this.$emit('hide-tooltip', event);
        }
    },
    computed: {
        min_txt_height: function() {
            return 2 * this.min_text_padding + this.text_height * 2 + this.min_text_padding;
        },
        inner_height: function() {
            return this.height - this.line_width * (this.buckets.length + 1);
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
  stroke-width:2;
  fill:rgba(38,166,154,1);
}

.bucket-item:hover {
  stroke:rgba(38,166,154,1);
  opacity: 0.8;
}

.active .bucket-item:hover {
  opacity: 0.8;
}

.bucket-item-text {
  font: 16px sans-serif;
  text-anchor: middle;
  fill: #333;
}
.active .bucket-item-text {
  fill: #fff;
}

.bucket-item-text.val {
  fill: #999;
  font-size:14px;
}

.active .bucket-item-text.val {
  fill: rgba(255,255,255,.7)
}



</style>
