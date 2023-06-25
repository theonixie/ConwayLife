class ConwayLife {
    // Creates a copy of the game of life.
    // This constructor is mostly copied from Chris Marriott's original code.
    constructor(game) {
        Object.assign(this, { game });

        // automata is a 2D array in the [x][y] format.
        this.automata = [];
        this.height = 96;
        this.width = 128;

        this.tickCount = 0;
        this.ticks = 0;

        this.speed = 120 - parseInt(document.getElementById("speed").value, 10);


        for (let col = 0; col < this.width; col++) {
            this.automata.push([]);
            for (let row = 0; row < this.height; row++) {
                this.automata[col][row] = 0;
            }
        }
        
        //this.loadGlider();
        this.loadRandomAutomata();
    };

    loadGlider() {
        this.automata[1][1] = 1;
        this.automata[2][2] = 1;
        this.automata[3][1] = 1;
        this.automata[3][2] = 1;
        this.automata[2][3] = 1;
    }

    loadRandomAutomata() {
        for(let x = 0; x < this.width; x++) {
            for(let y = 0; y < this.height; y++) {
                this.automata[x][y] = Math.random() < 0.1 ? 1 : 0;
            }
        }
    };

    count(xPos, yPos) {
        let total = 0;

        for(let x = xPos - 1; x <= xPos + 1; x++) {
            for(let y = yPos - 1; y <= yPos + 1; y++) {
                // Only add to count if this isn't the center cell.
                if(x != xPos || y != yPos) {
                    let xCheck = wrap(x, 0, this.width);
                    let yCheck = wrap(y, 0, this.height);
                    if(this.automata[xCheck][yCheck] == 1) total++;
                }
            }
        }

        return total;
    }

    update() {
        this.speed = 120 - parseInt(document.getElementById("speed").value, 10);

        this.ticks++;
        this.tickCount++;
        if(this.ticks >= this.speed) {
            this.ticks = 0;
            
            // We use an additional array to store the next timestep, then copy it into the main array.
            let nextStep = [];

            for (let col = 0; col < this.width; col++) {
                nextStep.push([]);
                for (let row = 0; row < this.height; row++) {
                    nextStep[col][row] = 0;
                }
            }

            for(let x = 0; x < this.width; x++) {
                for(let y = 0; y < this.height; y++) {
                    let cellTotal = this.count(x, y);
                    nextStep[x][y] = this.automata[x][y];
                    if(cellTotal < 2 || cellTotal > 3) nextStep[x][y] = 0;
                    if(cellTotal == 3) nextStep[x][y] = 1;
                }
            }

            this.automata = nextStep;
        }
    };

    // This renders the game of life on the canvas.
    // This code is partially based on Chris Marriott's code, with a few aesthetic additions ;)
    draw(ctx) {
        let size = 8;
        let gap = 1;
        let color = 0;
        let colorStep = 360 / this.width;
        ctx.fillStyle = "White";
        for (let row = 0; row < this.height; row++) {
            color = this.tickCount + (row * colorStep);
            while(color > 360) color -= 360;

            for (let col = 0; col < this.width; col++) {
                let cell = this.automata[col][row];
                ctx.fillStyle = hsl(color, 100, 50);
                color += colorStep;
                if(color > 360) color -= 360;
                if (cell) ctx.fillRect(col * size + gap, row * size + gap, size - 2 * gap, size - 2 * gap);
            }
        }
    };
}