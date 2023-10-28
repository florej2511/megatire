interface String{
    recortar(max?: number): String;
}

String.prototype.recortar = function(): String{
    if(this.length > 100) return this.slice(0,100) + ' ...';
    return this
}