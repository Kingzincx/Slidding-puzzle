class MinHeap {
  constructor(compare) {
    this.data = [];
    this.compare = compare;
  }

  size() {
    return this.data.length;
  }

  push(value) {
    this.data.push(value);
    this.bubbleUp(this.data.length - 1);
  }

  pop() {
    if (this.data.length === 0) return null;
    if (this.data.length === 1) return this.data.pop();

    const top = this.data[0];
    this.data[0] = this.data.pop();
    this.bubbleDown(0);
    return top;
  }

  bubbleUp(index) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.compare(this.data[index], this.data[parentIndex]) >= 0) break;

      [this.data[index], this.data[parentIndex]] = [
        this.data[parentIndex],
        this.data[index],
      ];
      index = parentIndex;
    }
  }

  bubbleDown(index) {
    const length = this.data.length;

    while (true) {
      let smallest = index;
      const left = index * 2 + 1;
      const right = index * 2 + 2;

      if (
        left < length &&
        this.compare(this.data[left], this.data[smallest]) < 0
      ) {
        smallest = left;
      }

      if (
        right < length &&
        this.compare(this.data[right], this.data[smallest]) < 0
      ) {
        smallest = right;
      }

      if (smallest === index) break;

      [this.data[index], this.data[smallest]] = [
        this.data[smallest],
        this.data[index],
      ];
      index = smallest;
    }
  }
}
