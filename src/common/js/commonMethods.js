function browserType() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    if (userAgent.indexOf("Opera") > -1) {
        return "Opera"
    }; //判断是否Opera浏览器
    if (userAgent.indexOf("Firefox") > -1) {
        return "FF";
    } //判断是否Firefox浏览器
    if (userAgent.indexOf("Chrome") > -1) {
        return "Chrome";
    }
    if (userAgent.indexOf("Safari") > -1) {
        return "Safari";
    } //判断是否Safari浏览器
    if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
        return "IE";
    }; //判断是否IE浏览器
    if (userAgent.indexOf("Trident") > -1) {
        return "Edge";
    } //判断是否Edge浏览器
};
function download(src) {
    var alink = document.createElement('a');
    alink.setAttribute("href", src);
    alink.setAttribute("download", '');
    alink.setAttribute('target','_blank');
    //var evObj = document.createEvent('MouseEvents');
    //evObj.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, true, false, 0, null);
    //alink.dispatchEvent(evObj);
    document.body.appendChild(alink);
    alink.click();
    document.body.removeChild(alink);
};

function SaveAs5(imgURL) {
    var oPop = window.open(imgURL, "", "width=1, height=1, top=5000, left=5000");
    for (; oPop.document.readyState != "complete";) {
        if (oPop.document.readyState == "complete") break;
    }
    oPop.document.execCommand("SaveAs");
    oPop.close();
};

function downLoadFile(url) {
    if (browserType() === "IE" || browserType() === "Edge") {
        SaveAs5(url);
    } else {
        download(url);
    }
};

/*
*多维数组数组扁平化
*/
function arrayChildrenFlatten(array, result) {
    for (var i = 0; i < array.length; i++) {
        var item = array[i];
        result.push(item);
        if (item.children && item.children.length > 0) {
            result = arrayChildrenFlatten(item.children, result);
        }
    }
    return result;
}

function eachParent(node, tree_data, parent_prop, child_prop){
    if(node[parent_prop]==null)return null;
    for (let i = 0; i < tree_data.length; i++) {
        const item = tree_data[i];
        if(item[child_prop]==node[parent_prop]){
            return item;
        }
        if(item.children&& item.children.length>0){
            let p = eachParent(node, item.children, parent_prop);
            if(p!=null)
                return p;
        }
    }
    return null;
};
//获取树的Parent
function getTreeParent(node, tree_data, parent_prop, child_prop){
    return eachParent(node, tree_data, parent_prop, child_prop);
};
//获取树的节点的兄弟节点结合
function getTreeSiblings(node, tree_data, parent_prop, child_prop){
    let parent = eachParent(node, tree_data, parent_prop, child_prop);
    if(parent==null)
        return tree_data;
    return parent.children;
}
export{
    downLoadFile,
    getTreeParent,
    getTreeSiblings,
    arrayChildrenFlatten
}