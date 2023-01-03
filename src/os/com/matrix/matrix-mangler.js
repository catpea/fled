  import lo from 'lodash';

export function inflateMatrix(matrix, length){
  for (let rowIndex = 0; rowIndex < matrix.length; rowIndex++) {
    matrix[rowIndex] = matrix[rowIndex].concat(lo.times(length, lo.stubFalse))
  }
  console.log(matrix);
  return matrix;
}

export function deflateMatrix(matrix, length, min = 4){
  if(matrix[0].length - length >= min){
    for (let rowIndex = 0; rowIndex < matrix.length; rowIndex++) {
      matrix[rowIndex] = matrix[rowIndex].slice(0, matrix[rowIndex].length-length)
    }
  }
  return matrix;
}

export function doubleMatrix(matrix, length){
  for (let rowIndex = 0; rowIndex < matrix.length; rowIndex++) {
    const data = matrix[rowIndex].slice( matrix[rowIndex].length-length,  matrix[rowIndex].length-length+length);
    console.log(data);
    matrix[rowIndex] = matrix[rowIndex].concat(data)
  }
  return matrix;
}
