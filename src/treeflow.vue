<template>
    <div class="tree-container">
        <svg :height="height" :width="width">
            <g v-for="level in deep" :transform="translate(col_x_pos(level), 0)">
                <tree-col :width="col_width" :height="height" :buckets="buckets_map[level]" :selected="selections[level]" :level="level" @select="select" v-if="buckets_map[level].length">
                </tree-col>
            </g>
            <g v-for="level in conn_num" :transform="translate(conn_x_pos(level), 0)">
                <tree-conn :width="conn_width" :height="height" :buckets="buckets_map[level]" :left-selected="selections[level]" :right-selected="selections[level + 1]">
                </tree-conn>
            </g>
        </svg>
    </div>
</template>

<script>

import treeCol from './_treecol.vue'
import treeConn from './_treeconn.vue'

export default {
    props: {
        width: {
            type: Number,
            default: 500
        },
        height: {
            type: Number,
            default: 500
        },
        deep: {
            type: Number,
            default: 3
        },
        buckets: {
            type: Array
        },
        conn_ratio: {
            type: Number,
            default: 0.6
        }
    },
    data: function() {
        return {
            selections: [],
            buckets_map: []
        }
    },
    components: {
        treeCol,
        treeConn
    },
    methods: {
        col_x_pos: function(level) {
            return Math.round(this.step_width * level);
        },
        translate: function(x, y) {
            return 'translate(' + x + ',' + y + ')';
        },
        level_buckets: function(level) {
            var bkt = this.buckets;
            for (var i = 0; i < level; i++) {
                bkt = bkt[this.selection(i)].buckets;
            }
            return bkt;
        },
        select: function(index, level) {
            console.log('receive select event', level, index);
            this.selections.$set(level, index);
            this.update_buckets_map();
        },
        update_buckets_map: function() {
            var bkt = this.buckets;
            for (var i = 0; i < this.deep; i++) {
                let m = this.buckets_map[i];
                let len = m.length;
                m.splice.bind(m, 0, len).apply(m, bkt);

                // 处理buckets不存在情况
                var sel = this.selections[i];
                if (sel < bkt.length && bkt[sel].buckets) {
                    bkt = bkt[sel].buckets;
                } else {
                    bkt = [];
                }
            }
            console.log(this.selections);
        },
        conn_x_pos: function(level) {
            return Math.round(level * this.step_width) + this.col_width;
        }
    },
    computed: {
        step_width: function() {
            return this.width / (this.deep - this.conn_ratio);
        },
        col_width: function() {
            return Math.round(this.step_width * (1 - this.conn_ratio));
        },
        conn_width: function() {
            return Math.round(this.step_width * this.conn_ratio);
        },
        conn_num: function() {
            return this.deep - 1;
        }
    },
    created: function() {
        // 初始化selections
        for (var i = 0; i < this.deep; i++) {
            this.selections.$set(i, 0);
        }

        // 初始化buckets_map
        var bkt = this.buckets;
        for (var i = 0; i < this.deep; i++) {
            this.buckets_map.push([]);
            // copy from buckets instead of assignment
            for (var j = 0; j < bkt.length; j++) {
                this.buckets_map[i].push(bkt[j]);
            }

            // 处理buckets不存在情况
            var sel = this.selections[i];
            if (sel < bkt.length && bkt[sel].buckets) {
                bkt = bkt[sel].buckets;
            } else {
                bkt = []
            }
        }
    }
}
</script>

<!--style>
.tree-container {
    padding: 10px 20px 0 20px;
}
</style-->
