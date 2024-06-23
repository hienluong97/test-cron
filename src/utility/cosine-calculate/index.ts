function dotProduct(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error("vecA and vecB must be of the same length");
  }
  return vecA.reduce((acc, curr, idx) => acc + curr * vecB[idx], 0);
}

function magnitude(vec: number[]): number {
  return Math.sqrt(vec.reduce((acc, curr) => acc + curr * curr, 0));
}

function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const minLength = Math.min(vecA.length, vecB.length);
  const adjustedVecA = vecA.slice(0, minLength);
  const adjustedVecB = vecB.slice(0, minLength);

  const magnitudeA = magnitude(adjustedVecA);
  const magnitudeB = magnitude(adjustedVecB);

  if (magnitudeA === 0 || magnitudeB === 0) {
    throw new Error(
      "Cosine similarity is not defined for zero magnitude vectors"
    );
  }

  return dotProduct(adjustedVecA, adjustedVecB) / (magnitudeA * magnitudeB);
}


export default cosineSimilarity;