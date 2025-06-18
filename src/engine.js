class Field {
  constructor(type) {
    this.field = Array.from(Array(10), (x) => Array(10).fill(0));

    this.edgeFill = function(field) {
      function shuffle(arr) {
          return arr.sort(() => Math.random() - 0.5);
      }
      function func(row, ships) {
          let shipType = 0;
          for (let i = 0; i < 10; i++) {
              if (ships[shipType] === 0) {
                  shipType++;
              }
              else {
                  field[row][i] = 'x';
                  ships[shipType]--;
              }
          }
      }
      let ships = [[4, 2, 2], [3, 3, 2]];
      shuffle([0, 2]).forEach((e, i) => func(e, shuffle(ships[i])));
      }

    this.generateRandomField = function (startRow, ships) {

      let availableCoordinates = new Set();

      for (let i = startRow; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          availableCoordinates.add(String(i) + String(j));
        }
      }
      function func(n) {
        let currentAvailableCoordinates;

        let orientation = Math.floor(Math.random() * 2);

        if (orientation === 0) {
          currentAvailableCoordinates = Array.from(availableCoordinates)
            .filter((i) => i[1] <= 10 - n)
            .filter(function (i) {
              for (let a = 0; a < n; a++) {
                if (
                  !availableCoordinates.has(
                    String(Number(i) + a).padStart(2, "0")
                  )
                ) {
                  return false;
                }
              }
              return true;
            });
        } else {
          currentAvailableCoordinates = Array.from(availableCoordinates)
            .filter((i) => i[0] <= 10 - n)
            .filter(function (i) {
              for (let a = 0; a < n * 10; a += 10) {
                if (
                  !availableCoordinates.has(
                    String(Number(i) + a).padStart(2, "0")
                  )
                ) {
                  return false;
                }
              }
              return true;
            });
        }

        let randomCoordinates = String(
          currentAvailableCoordinates[
            Math.floor(Math.random() * currentAvailableCoordinates.length)
          ]
        ).padStart(2, "0");

        let x = randomCoordinates[0];
        let y = randomCoordinates[1];

        if (orientation === 0) {
          for (let i = 0; i < n; i++) {
            this.field[x][Number(y) + i] = "x";
          }
          for (let i = -1; i <= n; i++) {
            let a = Number(randomCoordinates) + i;
            let b = Number(randomCoordinates) - 10 + i;
            let c = Number(randomCoordinates) + 10 + i;
            availableCoordinates.delete(String(a).padStart(2, "0"));
            availableCoordinates.delete(String(b).padStart(2, "0"));
            availableCoordinates.delete(String(c).padStart(2, "0"));
          }
        } else {
          for (let i = 0; i < n; i++) {
            this.field[Number(x) + i][y] = "x";
          }
          for (let i = -10; i <= n * 10; i += 10) {
            let a = Number(randomCoordinates) + i;
            let b = Number(randomCoordinates) + i - 1;
            let c = Number(randomCoordinates) + i + 1;
            availableCoordinates.delete(String(a).padStart(2, "0"));
            availableCoordinates.delete(String(b).padStart(2, "0"));
            availableCoordinates.delete(String(c).padStart(2, "0"));
          }
        }
      }
      let generate = func.bind(this);
      ships.map((i) => generate(i));
    };
    this.shipDestroyed = function (x, y, field = this.field) {
      let result = true;
      let emptyCellsArray = [];
      function searchTop(x, y, field) {
        if (x - 1 >= 0) {
          if (field[x - 1][y] === "x") {
            result = false;
            return;
          }
          if (field[x - 1][y] === 0) {
            emptyCellsArray.push([x - 1, y]);
            return;
          }
          if (field[x - 1][y] === "X") {
            searchTop(x - 1, y, field);
          }
        } else return;
      }
      function searchRight(x, y, field) {
        if (y + 1 <= 9) {
          if (field[x][y + 1] === "x") {
            result = false;
            return;
          }
          if (field[x][y + 1] === 0) {
            emptyCellsArray.push([x, y + 1]);
            return;
          }
          if (field[x][y + 1] === "X") {
            searchRight(x, y + 1, field);
          }
        } else return;
      }
      function searchBottom(x, y, field) {
        if (x + 1 <= 9) {
          if (field[x + 1][y] === "x") {
            result = false;
            return;
          }
          if (field[x + 1][y] === 0) {
            emptyCellsArray.push([x + 1, y]);
            return;
          }
          if (field[x + 1][y] === "X") {
            searchBottom(x + 1, y, field);
          }
        } else return;
      }
      function searchLeft(x, y, field) {
        if (y - 1 >= 0) {
          if (field[x][y - 1] === "x") {
            result = false;
            return;
          }
          if (field[x][y - 1] === 0) {
            emptyCellsArray.push([x, y - 1]);
            return;
          }
          if (field[x][y - 1] === "X") {
            searchLeft(x, y - 1, field);
          }
        } else return;
      }
      searchTop(x, y, field);
      searchRight(x, y, field);
      searchBottom(x, y, field);
      searchLeft(x, y, field);
      return [result, emptyCellsArray];
    };
    (this.verify = function (field, x = 0, arrayResult = []) {
      let fieldCopy = Array.from(Array(10), (x) => Array(10).fill(0));
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          fieldCopy[i][j] = this.field[i][j];
        }
      }
      function func(field, x = 0, arrayResult = []) {
        let count = 0;
        for (let i = 0; i < field.length; i++) {
          for (let j = 0; j < field[i].length; j++) {
            if (i == 0) {
              if (field[i][j] === "x" && field[i + 1][j] !== "x") {
                if (j > 0 && j < 9) {
                  if (
                    field[i + 1][j - 1] !== "x" &&
                    field[i + 1][j + 1] !== "x"
                  ) {
                    field[i][j] = 0;
                    count++;
                  } else {
                    count = 0;
                  }
                }
                if (j == 0) {
                  if (field[i + 1][j + 1] !== "x") {
                    field[i][j] = 0;
                    count++;
                  } else {
                    count = 0;
                  }
                }
                if (j == 9) {
                  if (field[i + 1][j - 1] !== "x") {
                    field[i][j] = 0;
                    count++;
                  } else {
                    count = 0;
                  }
                }
              }
            } else if (i == 9) {
              if (field[i][j] === "x" && field[i - 1][j] !== "x") {
                if (j > 0 && j < 9) {
                  if (
                    field[i - 1][j - 1] !== "x" &&
                    field[i - 1][j + 1] !== "x"
                  ) {
                    field[i][j] = 0;
                    count++;
                  } else {
                    count = 0;
                  }
                }
                if (j == 0) {
                  if (field[i - 1][j + 1] !== "x") {
                    field[i][j] = 0;
                    count++;
                  } else {
                    count = 0;
                  }
                }
                if (j == 9) {
                  if (field[i - 1][j - 1] !== "x") {
                    field[i][j] = 0;
                    count++;
                  } else {
                    count = 0;
                  }
                }
              }
            } else {
              if (
                field[i][j] === "x" &&
                field[i - 1][j] !== "x" &&
                field[i + 1][j] !== "x"
              ) {
                if (j > 0 && j < 9) {
                  if (
                    field[i - 1][j - 1] !== "x" &&
                    field[i + 1][j - 1] !== "x" &&
                    field[i - 1][j + 1] !== "x" &&
                    field[i + 1][j + 1] !== "x"
                  ) {
                    field[i][j] = 0;
                    count++;
                  } else {
                    count = 0;
                  }
                }
                if (j == 0) {
                  if (
                    field[i - 1][j + 1] !== "x" &&
                    field[i + 1][j + 1] !== "x"
                  ) {
                    field[i][j] = 0;
                    count++;
                  } else {
                    count = 0;
                  }
                }
                if (j == 9) {
                  if (
                    field[i - 1][j - 1] !== "x" &&
                    field[i + 1][j - 1] !== "x"
                  ) {
                    field[i][j] = 0;
                    count++;
                  } else {
                    count = 0;
                  }
                }
              }
            }
            if (count > 0 && (j == 9 || field[i][j + 1] !== "x")) {
              arrayResult.push(count);
              count = 0;
            }
          }
        }
        if (x == 0) {
          return func(this.rotate(field), 1, arrayResult);
        } else {
          return (
            arrayResult.sort().toString() ==
            [1, 1, 1, 1, 2, 2, 2, 3, 3, 4].toString()
          );
        }
      }
      let fieldVerify = func.bind(this);
      return fieldVerify(fieldCopy);
    });
      this.rotate = function (field, repeat) {
        let fieldAfterRotate = Array.from(Array(10), (x) => Array(10).fill(0));
        for (let i = 0; i < field.length; i++) {
          for (let j = 0; j < field[i].length; j++) {
            fieldAfterRotate[j][field.length - 1 - i] = field[i][j];
          }
        }
        if (repeat) {
          return this.rotate(fieldAfterRotate, repeat - 1);
        } else {
          return fieldAfterRotate;
        }
      };
      this.getEmptyCells = function (x, y) {
        return [
          [x - 1, y - 1],
          [x - 1, y + 1],
          [x + 1, y - 1],
          [x + 1, y + 1],
        ];
      };
      
    if (type === 'random') {
      this.generateRandomField(0, [4, 3, 3, 2, 2, 2, 1, 1, 1, 1]);
    };
    if (type === 'edgeFill') {
      this.edgeFill(this.field);
      this.generateRandomField(4, [1, 1, 1, 1]);
      this.field = this.rotate(this.field, Math.floor(Math.random() * 4));
    };
  }
}

class Bot {
  constructor(fieldEnemy, mode, percent) {
    
    if (mode === 'percent') {
      
    this.shipsCoordinates = [];
    this.emptyCoordinates = [];
      
      this.parsingField = function() {
          for (let i = 0; i < 10; i++) {
              for (let j = 0; j < 10; j++) {
                  if (fieldEnemy[i][j] === 'x') {
                      this.shipsCoordinates.push([i, j]);
                  } else {
                      this.emptyCoordinates.push([i, j]);
                  }
              }
          }
      },
      this.parsingField();
      this.move = function () {
        let randomNumber = Math.floor(Math.random() * 100);
        let randomCoordinates, coordinates;
        let hit;
        function getShipsCoordinates() {
            randomCoordinates = Math.floor(Math.random() * this.shipsCoordinates.length);
            coordinates = this.shipsCoordinates[randomCoordinates];
            if (this.shipDestroyed(coordinates[0], coordinates[1], fieldEnemy) === true) {
              hit = true;
            } else {
              hit = false;
            }
            this.shipsCoordinates.splice(randomCoordinates, 1);
        };
        function getEmptyCoordinates() {
            randomCoordinates = Math.floor(Math.random() * this.emptyCoordinates.length);
            coordinates = this.emptyCoordinates[randomCoordinates];
            hit = false;
            this.emptyCoordinates.splice(randomCoordinates, 1);
        }
        
        if (randomNumber <= percent) {
            getShipsCoordinates.bind(this)();
        } else {
            if (this.emptyCoordinates.length === 0) {
                getShipsCoordinates.bind(this)();
            } else {
            getEmptyCoordinates.bind(this)();
            }
        }
        return [...coordinates, hit];
      }
  } else {
    
    this.move = function (field = fieldEnemy) {
      if (this.firstMove === true) {
        let arrayCoordinates = Array.from(this.availableCoordinates);
        let randomCoordinates = String(
          arrayCoordinates[Math.floor(Math.random() * arrayCoordinates.length)]
        ).padStart(2, "0");
        let x = randomCoordinates[0];
        let y = randomCoordinates[1];
        if (this.hitsCounter === 20) {
          return;
        }

        if (field[x][y] === "x") {
          this.availableCoordinates.delete(String(x) + String(y));
          field[x][y] = "X";
          if (this.shipDestroyed(Number(x), Number(y)) === true) {
            //* Ships die! */
            this.hitsCounter++;
            return [x, y, true];
          } else {
            this.hitsCounter++;
            this.hits.push(String(x) + String(y));
            this.firstMove = false;
            return [x, y, false];
          }
        } else {
          this.availableCoordinates.delete(String(x) + String(y));
          return [x, y];
        }
      } else {
        if (this.knownLocation === false) {
          let newX, newY;

          let currentX = Number(this.hits[0][0]);
          let currentY = Number(this.hits[0][1]);

          if (this.availableDestinations.length === 0) {
            if (
              currentX - 1 >= 0 &&
              this.availableCoordinates.has(
                String(currentX - 1) + String(currentY)
              )
            ) {
              this.availableDestinations.push("top");
            }
            if (
              currentX + 1 <= 9 &&
              this.availableCoordinates.has(
                String(currentX + 1) + String(currentY)
              )
            ) {
              this.availableDestinations.push("bottom");
            }
            if (
              currentY - 1 >= 0 &&
              this.availableCoordinates.has(
                String(currentX) + String(currentY - 1)
              )
            ) {
              this.availableDestinations.push("left");
            }
            if (
              currentY + 1 <= 9 &&
              this.availableCoordinates.has(
                String(currentX) + String(currentY + 1)
              )
            ) {
              this.availableDestinations.push("right");
            }
          }

          this.availableDestinations.sort(() => Math.random() - 0.5);

          if (this.availableDestinations[0] === "top") {
            newX = currentX - 1;
            newY = currentY;
          }

          if (this.availableDestinations[0] === "bottom") {
            newX = currentX + 1;
            newY = currentY;
          }

          if (this.availableDestinations[0] === "left") {
            newX = currentX;
            newY = currentY - 1;
          }

          if (this.availableDestinations[0] === "right") {
            newX = currentX;
            newY = currentY + 1;
          }

          this.availableDestinations.shift();

          this.availableCoordinates.delete(String(newX) + String(newY));

          if (field[newX][newY] === "x") {
            field[newX][newY] = "X";
            if (this.shipDestroyed(newX, newY) === true) {
              this.firstMove = true;
              this.hits.push(String(newX) + String(newY));
              this.hits.map((i) => this.deleteCoordinates(i));
              this.hits = [];
              this.availableDestinations = [];
              this.hitsCounter++;
              return [newX, newY, true];
            } else {
              this.hitsCounter++;
              if (newX != String(this.hits[0])[0]) {
                this.location = "vertical";
              }
              if (newY != String(this.hits[0])[1]) {
                this.location = "horizontal";
              }
              this.hits.push(String(newX) + String(newY));
              this.knownLocation = true;
              return [newX, newY, false];
            }
          } else {
            return [newX, newY];
          }
        } else {
          let newX, newY;

          let lastX, lastY;

          lastX = String(this.hits[this.hits.length - 1])[0];
          lastY = String(this.hits[this.hits.length - 1])[1];
          let bottom, top, left, right;

          if (this.location === "vertical") {
            bottom = Math.min(...this.hits) - 10;
            top = Math.max(...this.hits) + 10;
            newY = lastY;
            if (bottom >= 10) {
              if (
                String(bottom)[0] >= 0 &&
                this.availableCoordinates.has(String(bottom))
              ) {
                newX = String(bottom)[0];
              } else {
                newX = String(top)[0];
              }
            } else {
              if (
                String(bottom)[0] >= 0 &&
                this.availableCoordinates.has(String(0) + String(bottom))
              ) {
                newX = 0;
              } else {
                newX = String(top)[0];
              }
            }
          }

          if (this.location === "horizontal") {
            left = Math.min(...this.hits) - 1;
            right = Math.max(...this.hits) + 1;
            newX = lastX;
            if (left >= 10) {
              if (
                String(left)[1] != 9 &&
                this.availableCoordinates.has(String(left))
              ) {
                newY = String(left)[1];
              } else {
                newY = String(right)[1];
              }
            } else {
              if (
                String(left)[0] != 9 &&
                this.availableCoordinates.has(String(0) + String(left))
              ) {
                newY = String(left)[0];
              } else {
                newY = String(right)[0];
              }
            }
          }

          this.availableCoordinates.delete(String(newX) + String(newY));

          if (field[newX][newY] === "x") {
            field[newX][newY] = "X";
            if (this.shipDestroyed(Number(newX), Number(newY), field) === true) {
              this.firstMove = true;
              this.hits.push(String(newX) + String(newY));
              this.hits.map((i) => this.deleteCoordinates(i));
              this.hits = [];
              this.availableDestinations = [];
              this.knownLocation = false;
              this.location = "";
              this.hitsCounter++;
              return [newX, newY, true];
            } else {
              this.hits.push(String(newX) + String(newY));
              this.hitsCounter++;
              return [newX, newY, false];
            }
          } else {
            return [newX, newY];
          }
        }
      }
    };
  }
    this.availableCoordinatesInitialize = function () {
      let coordinates = new Set();
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          coordinates.add(String(i) + String(j));
        }
      }
      return coordinates;
    };
    this.availableCoordinates = this.availableCoordinatesInitialize();
    this.deleteCoordinates = function (coordinates) {
      for (let i = -1; i <= 1; i++) {
        this.availableCoordinates.delete(
          String(Number(coordinates) + i).padStart(2, "0")
        );
        this.availableCoordinates.delete(
          String(Number(coordinates) + i - 10).padStart(2, "0")
        );
        this.availableCoordinates.delete(
          String(Number(coordinates) + i + 10).padStart(2, "0")
        );
      }
    };
    this.shipDestroyed = function (x, y, field = fieldEnemy) {
      let result = true;
      function searchTop(x, y, field) {
        if (x - 1 >= 0) {
          if (field[x - 1][y] === "x") {
            result = false;
            return;
          }
          if (field[x - 1][y] === 0) {
            return;
          }
          if (field[x - 1][y] === "X") {
            searchTop(x - 1, y, field);
          }
        } else return;
      }
      function searchRight(x, y, field) {
        if (y + 1 <= 9) {
          if (field[x][y + 1] === "x") {
            result = false;
            return;
          }
          if (field[x][y + 1] === 0) {
            return;
          }
          if (field[x][y + 1] === "X") {
            searchRight(x, y + 1, field);
          }
        } else return;
      }
      function searchBottom(x, y, field) {
        if (x + 1 <= 9) {
          if (field[x + 1][y] === "x") {
            result = false;
            return;
          }
          if (field[x + 1][y] === 0) {
            return;
          }
          if (field[x + 1][y] === "X") {
            searchBottom(x + 1, y, field);
          }
        } else return;
      }
      function searchLeft(x, y, field) {
        if (y - 1 >= 0) {
          if (field[x][y - 1] === "x") {
            result = false;
            return;
          }
          if (field[x][y - 1] === 0) {
            return;
          }
          if (field[x][y - 1] === "X") {
            searchLeft(x, y - 1, field);
          }
        } else return;
      }
      searchTop(x, y, field);
      searchRight(x, y, field);
      searchBottom(x, y, field);
      searchLeft(x, y, field);
      return result;
    };
    this.availableDestinations = [];
    this.knownLocation = false;
    this.location = "";
    this.hits = [];
    this.hitsCounter = 0;
    this.firstMove = true;
  }
}

export { Field, Bot };
