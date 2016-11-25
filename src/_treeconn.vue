<template>
<g class="tree-conn">
    <g v-for="bkt in child_buckets">
        <path :d="path_data($index)" class="bucket-conn" :class="{'active': $index == rightSelected}">
        </path>
    </g>
</g>
</template>

<script>

import YPosApi from './_yposapi'

function Point(x, y) {
    this.x = x;
    this.y = y;
}

Point.prototype.toString = function() {
    return this.x + ',' + this.y;
}

export default {
    data() {
        return {
            tip_len: 5,  // 末梢长度
        }
    },
    props: {
        width: {
            type: Number,
            default: 50  // 必须大于2*tip_len
        },
        height: {
            type: Number,
            default: 400
        },
        buckets: {
            type: Array,
        },
        leftSelected: {
            type: Number,
            default: 0
        },
        rightSelected: {
            type: Number,
            default: 0
        }
    },
    methods: {
        points_data: function(index) {
            var bkt = this.child_buckets[index];
            var left_top = this.left_top_pos + this.conn_top_pos(this.child_buckets, index, this.left_height);
            var left_bottom = left_top + bkt.data.ratio * this.left_height;

            var right_top = this.child_ypos_api.getYPos(index);
            var right_bottom = right_top + this.child_ypos_api.getHeight(index);
            return [left_top, right_top, right_bottom, left_bottom];
        },
        path_data: function(index) {
            var points = this.points_data(index);
            var lt = points[0], rt = points[1],  rb = points[2], lb = points[3];
            var A = new Point(0, lt);
            var B = new Point(this.tip_len, lt);
            var C = new Point(this.width - this.tip_len, rt);
            var D = new Point(this.width, rt);
            var E = new Point(this.width, rb);
            var F = new Point(this.width - this.tip_len, rb);
            var G = new Point(this.tip_len, lb);
            var H = new Point(0, lb);
            var J = new Point(this.width / 2, rt);
            var K = new Point(this.width / 2, lb);
            var L = new Point(this.width / 2, rb);
            var M = new Point(this.width / 2, lt);
            return 'M' + A + 'L' + B + 'C' + M + ' ' + J + ' ' + C + 'L' + D + 'L' + E + 'L' + F + 'C' + L
                + ' ' + K + ' ' + G + 'L' + H + 'z';
        },
        conn_top_pos: function(buckets, index, height) {
            var ratio = 0;
            for (var i = 0; i < index; i++) {
                ratio += buckets[i].data.ratio;
            }
            return ratio * height;
        }
    },
    computed: {
        child_buckets: function() {
            if(this.buckets.length < this.leftSelected + 1) {
                return [];
            }
            return this.buckets[this.leftSelected].buckets;
        },
        left_top_pos: function() {
            return this.ypos_api.getYPos(this.leftSelected);
        },
        left_height: function() {
            return this.ypos_api.getHeight(this.leftSelected);
        },
        ypos_api: function() {
            return new YPosApi(this.buckets, this.height);
        },
        child_ypos_api: function() {
            return new YPosApi(this.child_buckets, this.height);
        }
    }
}
</script>

<style>
.bucket-conn {
    fill:rgba(180,180,180,.6);
}
.bucket-conn.active {
    fill:rgba(38,166,154,.5);
}

.bucket-conn-text {
    font: 16px san-serif;
    text-anchor: middle;
    fill: white;
}
</style>
