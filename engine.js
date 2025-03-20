let canvas, ctx;

const width = 700;
const height = 700;

let instances = [];

{
    canvas = document.getElementById("scene");
    ctx = canvas.getContext("2d");

    targets_count = document.getElementById("targets");
    targets_count.addEventListener("change", loadEnv, false);
    loadEnv();

    setInterval(update, 150);
}

function loadEnv() {
    instances = [];
    targets_count = document.getElementById("targets");

    targets = new Targets(targets_count.value);
    input_mapped_positions = [];
    targets.targets.forEach(element => {
        input_mapped_positions.push([element.x, element.y]);
    });

    shortest_path = nearestNeighbor(input_mapped_positions);
    shortest_targets = [];
    shortest_path.forEach(element => {
        shortest_targets.push(new Pos(element[0], element[1]));
    });
    robot = new Robot(shortest_targets);

    instances.push(targets);
    instances.push(robot);
}

function Pos(x, y) {
    this.x = x;
    this.y = y;
}

function Robot(targets) {
    this.targets = targets;
    this.current_target_idx = 0;

    this.position = new Pos(350, 0);

    delta_x = (this.targets[this.current_target_idx].x - this.position.x) / 50;
    delta_y = (this.targets[this.current_target_idx].y - this.position.y) / 50;
    this.delta = new Pos(delta_x, delta_y);

    this.size = 15;
}

Robot.prototype.draw = function () {
    ctx.fillStyle = "#bd0808";
    if (Math.sqrt(Math.pow(this.targets[this.current_target_idx].x - this.position.x, 2) +
        Math.pow(this.targets[this.current_target_idx].y - this.position.y, 2)) < 1) {
        this.current_target_idx++;
        if (this.current_target_idx == this.targets.length) {
            this.current_target_idx = 0;
            this.targets = [new Pos(350, 0)];
        }
        delta_x = (this.targets[this.current_target_idx].x - this.position.x) / 50;
        delta_y = (this.targets[this.current_target_idx].y - this.position.y) / 50;
        this.delta = new Pos(delta_x, delta_y);
    }
    this.position.x = this.position.x + this.delta.x;
    this.position.y = this.position.y + this.delta.y;
    ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
};

function Targets(count) {
    this.targets = [];
    this.size = 15;

    for (let idx = 0; idx < count; idx++) {
        let newTarget;
        let collision;
        let attempts = 0;

        do {
            collision = false;
            newTarget = new Pos(
                Math.random() * (width - this.size),
                Math.random() * (height - this.size)
            );

            for (let existingTarget of this.targets) {
                if (checkCollision(newTarget, existingTarget, this.size)) {
                    collision = true;
                    break;
                }
            }

            attempts++;
            if (attempts > 1000) {
                break;
            }
        } while (collision);

        this.targets.push(newTarget);
    }
}

function checkCollision(pos1, pos2, size) {
    return (
        pos1.x < pos2.x + size &&
        pos1.x + size > pos2.x &&
        pos1.y < pos2.y + size &&
        pos1.y + size > pos2.y
    );
}

Targets.prototype.draw = function () {
    ctx.fillStyle = "#000000";
    this.targets.forEach(target => {
        ctx.fillRect(target.x, target.y, this.size, this.size);
    });
};

function update() {
    ctx.clearRect(0, 0, width, height);
    instances.forEach(instance => {
        instance.draw();
    });
}

function calculateDistance(point1, point2) {
    const dx = point1[0] - point2[0];
    const dy = point1[1] - point2[1];

    return Math.sqrt(dx * dx + dy * dy);
}

function nearestNeighbor(coordinates) {
    const path = [coordinates[0]];
    let remaining = coordinates.slice(1);

    while (remaining.length > 0) {
        let last = path[path.length - 1];
        let nearestIdx = 0;
        let nearestDist = calculateDistance(last, remaining[0]);

        for (let i = 1; i < remaining.length; i++) {
            let dist = calculateDistance(last, remaining[i]);
            if (dist < nearestDist) {
                nearestDist = dist;
                nearestIdx = i;
            }
        }

        path.push(remaining[nearestIdx]);
        remaining.splice(nearestIdx, 1);
    }

    return path;
}
