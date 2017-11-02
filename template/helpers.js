let clamp = function(val, min, max){
  if(val < min){
    return min;
  }else if (val > max) {
    return max;
  }else{
    return val;
  }
}

let relative_x = function(x){
    return x - margin.left;
}
