function YPosApi(buckets, height) {
    this.buckets = buckets;
    this.height = height;
    this.min_txt_height = this.getMinTextHeight();  // 最小容纳的文本高度
    this.r = this.getR();
    this.inner_height = this.getInnerHeight();
}

YPosApi.prototype.line_width = 1;
YPosApi.prototype.text_height = 16;  // 文本行高度
YPosApi.prototype.min_bkt_height = 2;  // 最小类目高度
YPosApi.prototype.text_padding = 6;  // 文本行间距
YPosApi.prototype.bkt_margin = 10;  // 类目之间间隔距离

YPosApi.prototype.getMinTextHeight = function() {
    return 2 * this.text_padding + this.text_height * 2 + this.text_padding;
};

YPosApi.prototype.getR = function() {  // 计算需要将文本放在矩形框外面的最小索引
    var N = this.buckets.length;
    var r = N;  // 初始设置不能容忍文本的最大类目序号
    var H_a = this.height - (N - 1) * this.bkt_margin;
    var H_c = H_a;  // 除去矩形外文本后的容忍高度
    for(let i = 0; i < r; i++) {
        if(this.buckets[i].data.ratio * H_c >= this.min_txt_height) {
            continue;
        }
        r = i;
        i = 0;
        H_c = H_a - (N - r) * this.min_txt_height;
    }
    return r;
};

YPosApi.prototype.getInnerHeight = function() {
    var N = this.buckets.length;
    return this.height - (N - 1) * this.bkt_margin - (N - this.r) * this.min_txt_height;
};

YPosApi.prototype.getYPos = function(index) {
    var ratio = 0;
    for(var i = 0; i < index; i++) {
        ratio += this.buckets[i].data.ratio;
    }
    if(index < this.r) {
        return ratio * this.inner_height + index * this.bkt_margin;
    } else {
        return ratio * this.inner_height + (index - this.r) * this.min_txt_height + index * this.bkt_margin;
    }
};

YPosApi.prototype.getHeight = function(index) {
    var height = this.inner_height * this.buckets[index].data.ratio;
    if(height < this.min_bkt_height) {
        return this.min_bkt_height;
    }
    return height;
};

YPosApi.prototype.getTextPos = function(index) {
    var bkt_height = this.inner_height * this.buckets[index].data.ratio;
    if(index < this.r) {
        return bkt_height / 2 - this.text_padding / 2;
    } else {
        return bkt_height + this.text_padding + this.text_height;
    }
}

export default YPosApi;
