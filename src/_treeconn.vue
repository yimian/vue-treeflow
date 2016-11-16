<template>
<g>
    <defs>
        <linearGradient id="_MyGradient">
            <stop offset="5%" stop-color="rgb(252,121,49)"></stop>
            <stop offset="100%" stop-color="white"></stop>
        </linearGradient>
    </defs>
    <g v-for="bkt in child_buckets">
        <polygon :points="points($index)" class="bucket-conn" fill="url(#_MyGradient)" :class="{'active': $index == rightSelected}">
        </polygon>
        <text class="bucket-conn-text" :x="width / 2" :y="text_y_pos($index)">{{ conn_text(bkt) }}</text>
    </g>
</g>
</template>

<script>
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
            var left_top = this.left_top_pos + this.bkt_top_pos(this.child_buckets, index, this.left_height);
            var left_bottom = left_top + Math.round(bkt.data.ratio * this.left_height) - 1;

            var right_top = this.bkt_top_pos(this.child_buckets, index, this.height);
            var right_bottom = right_top + Math.round(bkt.data.ratio * this.height) - 1;
            return [left_top, right_top, right_bottom, left_bottom];
        },
        points: function(index) {
            var data = this.points_data(index);
            return "0," + data[0] + " " + this.width + "," + data[1] + " " + this.width + "," + data[2] + " " + "0," + data[3];
        },
        text_y_pos: function(index) {
            var data = this.points_data(index);
            var left_middle = (data[0] + data[1]) / 2;
            var right_middle = (data[2] + data[3]) / 2;
            return Math.round((left_middle + right_middle) / 2);
        },
        bkt_top_pos: function(buckets, index, height) {
            var ratio = 0;
            for (var i = 0; i < index; i++) {
                ratio += buckets[i].data.ratio;
            }
            return Math.round(ratio * height);
        },
        conn_text: function(bkt) {
            var percent = Math.round(bkt.data.ratio * 100 * 10) / 10;
            return '' + percent + '%';
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
            return this.bkt_top_pos(this.buckets, this.leftSelected, this.height);
        },
        left_height: function() {
            return Math.round(this.buckets[this.leftSelected].data.ratio * this.height);
        }
    }
}
</script>

<style>
.bucket-conn.active {
    stroke: yellow;
    stroke-width: 2;
}

.bucket-conn-text {
    font: 16px san-serif;
    text-anchor: middle;
    fill: white;
}
</style>
