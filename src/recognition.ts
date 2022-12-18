import { Line } from "./lines";
import { intersect } from "./math";

export class Recognition {
    isComputing: boolean = false;
    lineGroups: any = null;
    computeStroke(strokesLines: Array<Line>) {
        const intersectingLines = this.intersectingLines(strokesLines);
        const ids: Array<number> = this.getIds(strokesLines);
        const intersectingLinesIds = this.getIdsIntersecting(intersectingLines);
        const notIntersectingLinesIds = this.getNotIntersectingIds(ids, intersectingLinesIds);
        const linegroups = this.getStrokeLineGroups(strokesLines, intersectingLinesIds, notIntersectingLinesIds);
        this.lineGroups = linegroups;
    }
    getLineOfId(strokesLines: Array<Line>, lineId: number) {
        return strokesLines.filter(sl => sl.id === lineId)
    }
    getIds(strokesLines: Array<Line>): Array<number> {
        let result = []
        strokesLines.forEach(sl => {
            if (!result.includes(sl.id)) {
                result.push(sl.id);
            }
        });
        return result;
    }
    getIdsIntersecting(intersectingGroups: any) {
        let result = []
        intersectingGroups.forEach(ig => {
            ig.forEach(id => {
                result.push(id);
            });
        });
        return result;
    }
    getNotIntersectingIds(ids, intersectingIds) {
        let result = []
        ids.forEach(id => {
            if (!intersectingIds.includes(id)) {
                result.push(id);
            }
        })
        return result;
    }
    totalDistance(strokesLines: Array<Line>) {
        let totalDistanceOfLineInPixels = 0;
        strokesLines.forEach((line: Line) => {
            const distanceOfLineInPixels = Math.hypot(line.endX - line.startX, line.endY - line.startY);
            totalDistanceOfLineInPixels += distanceOfLineInPixels;
        });
        console.log("Line total distance in pixels", totalDistanceOfLineInPixels);
    }
    totalTime(strokesLines: Array<Line>) {
        let totalTimeInMilliseconds = 0;
        strokesLines.forEach(line => {
            totalTimeInMilliseconds += line.deltaTimeInMilliseconds;
        });
    }
    angles(strokesLines: Array<Line>) {
        const angleBetweenPointsInDegree1 = (startX, startY, endX, endY) => {
            const deltaY = startY - endY;
            const deltaX = startX - endX;
            const angleInRadians = Math.atan2(deltaY, deltaX);
            const angleInDegrees = angleInRadians * (180 / Math.PI);
            return angleInDegrees;
        }
        
        const rotationFix = (deltaAngle) => Math.abs(deltaAngle) > 180 ? (360 - Math.abs(deltaAngle)) * (deltaAngle / Math.abs(deltaAngle)) : deltaAngle;

        let totalAngleChangeInDegrees = 0;
        let leftTurns = 0;
        let rightTurns = 0;
        let currentAngle = angleBetweenPointsInDegree1(strokesLines[0].startX, strokesLines[0].startY, strokesLines[0].endX, strokesLines[0].endY);
        const lineStartingAngle = currentAngle;
        console.log("Line starting angle", lineStartingAngle);
        for (let x = 1; x < strokesLines.length; x++) {
            const previousAngle = angleBetweenPointsInDegree1(strokesLines[x - 1].startX, strokesLines[x - 1].startY, strokesLines[x - 1].endX, strokesLines[x - 1].endY);
            const nextAngle = angleBetweenPointsInDegree1(strokesLines[x].startX, strokesLines[x].startY, strokesLines[x].endX, strokesLines[x].endY);
            const deltaAngle = rotationFix(previousAngle - nextAngle);
            totalAngleChangeInDegrees += deltaAngle;
            currentAngle += deltaAngle;
            if (currentAngle >= 360) {
                leftTurns++;
                currentAngle = currentAngle - 360;
            } else if (currentAngle <= -360) {
                rightTurns++;
                currentAngle = currentAngle + 360;
            }
        }
        console.log("Line total angle change in degrees", totalAngleChangeInDegrees);
        console.log("Line full circle to right: " + rightTurns);
        console.log("Line full circle to left: " + leftTurns);
    }
    deltaAngle(strokesLines: Array<Line>): number {
        const angleBetweenPointsInDegree1 = (startX, startY, endX, endY) => {
            const deltaY = startY - endY;
            const deltaX = startX - endX;
            const angleInRadians = Math.atan2(deltaY, deltaX);
            const angleInDegrees = angleInRadians * (180 / Math.PI);
            return angleInDegrees;
        }
        
        const rotationFix = (deltaAngle) => Math.abs(deltaAngle) > 180 ? (360 - Math.abs(deltaAngle)) * (deltaAngle / Math.abs(deltaAngle)) : deltaAngle;

        let totalAngleChangeInDegrees = 0;
        let leftTurns = 0;
        let rightTurns = 0;
        let currentAngle = angleBetweenPointsInDegree1(strokesLines[0].startX, strokesLines[0].startY, strokesLines[0].endX, strokesLines[0].endY);
        const lineStartingAngle = currentAngle;
        console.log("Line starting angle", lineStartingAngle);
        for (let x = 1; x < strokesLines.length; x++) {
            const previousAngle = angleBetweenPointsInDegree1(strokesLines[x - 1].startX, strokesLines[x - 1].startY, strokesLines[x - 1].endX, strokesLines[x - 1].endY);
            const nextAngle = angleBetweenPointsInDegree1(strokesLines[x].startX, strokesLines[x].startY, strokesLines[x].endX, strokesLines[x].endY);
            const deltaAngle = rotationFix(previousAngle - nextAngle);
            totalAngleChangeInDegrees += deltaAngle;
            currentAngle += deltaAngle;
            if (currentAngle >= 360) {
                leftTurns++;
                currentAngle = currentAngle - 360;
            } else if (currentAngle <= -360) {
                rightTurns++;
                currentAngle = currentAngle + 360;
            }
        }
        console.log("Line total angle change in degrees", totalAngleChangeInDegrees);
        console.log("Line full circle to right: " + rightTurns);
        console.log("Line full circle to left: " + leftTurns);
        return totalAngleChangeInDegrees;
    }
    /**
     * Take array of stroke lines and return array of stroke line id arrays that are intersected together.
     * @param strokesLines: Array<Line> 
     * @returns arrayOfIntersectingLineIdArray: Array<Array<number>>
     */
    intersectingLines(strokesLines: Array<Line>): Array<Array<number>> {
        type Intersection = [Line, Line];
        let intersections: Array<Intersection> = [];

        for (let index1 = 0; index1 < strokesLines.length; index1++) {
            for (let index2 = 0; index2 < strokesLines.length; index2++) {
                if (index1 !== index2) {
                    const intersection = intersect(
                        strokesLines[index1].startX,
                        strokesLines[index1].startY,
                        strokesLines[index1].endX,
                        strokesLines[index1].endY,
                        strokesLines[index2].startX,
                        strokesLines[index2].startY,
                        strokesLines[index2].endX,
                        strokesLines[index2].endY);
                    if (intersection !== null) {
                        intersections.push([strokesLines[index1], strokesLines[index2]])
                    }
                }
            }
        }

        let uniqueIntersections: Array<Intersection> = [];
        intersections.forEach((intersection: Intersection) => {
            const found = uniqueIntersections.findIndex((ui: Intersection) => {
                const isSameIntersection = intersection[0].id === ui[0].id ||
                    intersection[0].id === ui[1].id
                    &&
                    intersection[1].id === ui[0].id ||
                    intersection[1].id === ui[1].id;

                return isSameIntersection;
            })
            if (found === -1) {
                uniqueIntersections.push(intersection);
            }
        });

        let listOfUniqueIdsIntersecting = [];
        uniqueIntersections.forEach((intersectionsInUniqueIntersections) => {
            // console.log(intersectionsInUniqueIntersections)
            if (!listOfUniqueIdsIntersecting.includes(intersectionsInUniqueIntersections[0].id)) {
                listOfUniqueIdsIntersecting.push(intersectionsInUniqueIntersections[0].id)
            }
            if (!listOfUniqueIdsIntersecting.includes(intersectionsInUniqueIntersections[1].id)) {
                listOfUniqueIdsIntersecting.push(intersectionsInUniqueIntersections[1].id)
            }
        })

        const uniqueIntersectionsLength = uniqueIntersections.length;
        let intersectingLinesGroups = [];
        
        listOfUniqueIdsIntersecting.forEach(id => {
            let idSpecificList = [];
            uniqueIntersections.forEach((uniqueIntersection) => {
                if (id === uniqueIntersection[0].id) {
                    idSpecificList.push(uniqueIntersection[1].id)
                } else if (id === uniqueIntersection[1].id) {
                    idSpecificList.push(uniqueIntersection[0].id)
                }
            });
            idSpecificList.push(id);
            intersectingLinesGroups.push({ id: id, list: idSpecificList });
        });
        
        intersectingLinesGroups.forEach(ilg => {
            ilg.list = ilg.list.sort();
        });
        
        function arrayEquals(a, b) {
            return Array.isArray(a) &&
                Array.isArray(b) &&
                a.length === b.length &&
                a.every((val, index) => val === b[index]);
        }

        let uniqueIntersectionGroups = [];
        intersectingLinesGroups.forEach((ilg, index) => {
            if (index === 0) {
                uniqueIntersectionGroups.push(ilg);
            } else if (uniqueIntersectionGroups.findIndex((uig, index2) => {
                if (index === index2) return false;
                return arrayEquals(uig.list, ilg.list)
            }) === -1) {
                uniqueIntersectionGroups.push(ilg);
            }
        })
        
        let result: Array<Array<number>> = []
        uniqueIntersectionGroups.forEach(uig => {
            result.push(uig.list);
        });
        
        return result;
    }
    getStrokeLineGroups(strokesLines: Array<Line>, intersectingLines: Array<number>, uniqueLines: Array<number>) {
        
        const ids = this.getIds(strokesLines);
        let sortedGroups = []
        let letterId = 0;

        if (ids.length === 1) {
            const id = ids[0];
            if (uniqueLines.includes(id)) {
                console.log('is unique line');
            }
            const lineOfId = this.getLineOfId(strokesLines, id);
            const bbox = this.bboxMinMaxXY(lineOfId);
            const isLineHorizontal = this.isLineHorizontal(lineOfId);
            const deltaAngle = this.deltaAngle(lineOfId);
            let letterGroup = {
                letterId: letterId,
                ids: [id],
                lineStrokes: [
                    {
                        id: id,
                        bbox: bbox,
                        lineOfId: lineOfId,
                        isHorizontal: isLineHorizontal,
                        isVertical: !isLineHorizontal,
                        xyratio: this.xyRatio(lineOfId),
                        isStraightCornerCurve: this.hasLineCurveOrHardCorner(deltaAngle),
                        deltaAngle: deltaAngle
                    }
                ],
                strokeCount: 1,
                debugLetterLocation: {
                    x: bbox[0],
                    y: bbox[2] - 20
                },
                letter: ""
            };
            const letter = this.isLetter(letterGroup);
            console.log(letter);
        } else if (ids.length > 1) {
            
            const lineStrokes = ids.map(id => {
                const lineOfId = this.getLineOfId(strokesLines, id);
                const bbox = this.bboxMinMaxXY(lineOfId);
                const isLineHorizontal = this.isLineHorizontal(lineOfId);
                return {
                    id: id,
                    bbox: bbox,
                    lineOfId: lineOfId,
                    isHorizontal: isLineHorizontal,
                    isVertical: !isLineHorizontal,
                    xyratio: this.xyRatio(lineOfId),
                };
            });
            
            const bboxes = ids.map(id => {
                const lineOfId = this.getLineOfId(strokesLines, id);
                const bbox = this.bboxMinMaxXY(lineOfId);
                return bbox;
            })
            let bbox = [0, 0, 0, 0];
            
            let letterGroup = {
                letterId: letterId,
                ids: ids, 
                lineStrokes: lineStrokes,
                strokeCount: ids.length,
                letter: "" 
            };
            const letter = this.isLetter(letterGroup);
            console.log(letter);
        }

        console.log(sortedGroups);
        return sortedGroups;
    }
    isLineHorizontal(strokeLines: Array<Line>): boolean {
        if (strokeLines === undefined || strokeLines === null) return;
        if (strokeLines && strokeLines.length === 0) return;
        let minX: number = strokeLines[0].startX;
        let minY: number = strokeLines[0].startY;
        let maxX: number = strokeLines[0].startX;
        let maxY: number = strokeLines[0].startY;

        strokeLines.forEach(sl => {
            if (minX > sl.startX) {
                minX = sl.startX;
            }
            if (minX > sl.endX) {
                minX = sl.startX;
            }
            if (minY > sl.startY) {
                minX = sl.startY;
            }
            if (minY > sl.endY) {
                minX = sl.startY;
            }

            if (maxX < sl.startX) {
                maxX = sl.startX;
            }
            if (maxX < sl.endX) {
                maxX = sl.startX;
            }
            if (maxY < sl.startY) {
                maxY = sl.startY;
            }
            if (maxY < sl.endY) {
                maxY = sl.startY;
            }
        });

        const isHorizontal = Math.abs(minX - maxX) > Math.abs(minY - maxY);
        console.log("isLineHorizontal")
        console.log(strokeLines)
        console.log(minX)
        console.log(maxX)
        console.log(minY)
        console.log(maxY)
        console.log(isHorizontal)

        return isHorizontal;
    }
    xyRatio(strokeLines: Array<Line>): number {
        if (strokeLines === undefined || strokeLines === null) return;
        if (strokeLines && strokeLines.length === 0) return;
        let minX: number = strokeLines[0].startX;
        let minY: number = strokeLines[0].startY;
        let maxX: number = strokeLines[0].startX;
        let maxY: number = strokeLines[0].startY;

        strokeLines.forEach(sl => {
            if (minX > sl.startX) {
                minX = sl.startX;
            }
            if (minX > sl.endX) {
                minX = sl.startX;
            }
            if (minY > sl.startY) {
                minX = sl.startY;
            }
            if (minY > sl.endY) {
                minX = sl.startY;
            }

            if (maxX < sl.startX) {
                maxX = sl.startX;
            }
            if (maxX < sl.endX) {
                maxX = sl.startX;
            }
            if (maxY < sl.startY) {
                maxY = sl.startY;
            }
            if (maxY < sl.endY) {
                maxY = sl.startY;
            }
        });

        const ratio = Math.abs(minX - maxX) / Math.abs(minY - maxY);
        console.log("xyRatio")
        console.log(ratio)

        return ratio;
    }
    bboxMinMaxXY(strokeLines: Array<Line>): Array<number> {
        if (strokeLines === undefined || strokeLines === null) return;
        if (strokeLines && strokeLines.length === 0) return;
        let minX: number = strokeLines[0].startX;
        let minY: number = strokeLines[0].startY;
        let maxX: number = strokeLines[0].startX;
        let maxY: number = strokeLines[0].startY;

        strokeLines.forEach(sl => {
            if (minX > sl.startX) {
                minX = sl.startX;
            }
            if (minX > sl.endX) {
                minX = sl.startX;
            }
            if (minY > sl.startY) {
                minX = sl.startY;
            }
            if (minY > sl.endY) {
                minX = sl.startY;
            }

            if (maxX < sl.startX) {
                maxX = sl.startX;
            }
            if (maxX < sl.endX) {
                maxX = sl.startX;
            }
            if (maxY < sl.startY) {
                maxY = sl.startY;
            }
            if (maxY < sl.endY) {
                maxY = sl.startY;
            }
        });

        const result = [minX, maxX, minY, maxY]
        console.log("xyRatio")
        console.log(result)

        return result;
    }
    hasLineCurveOrHardCorner(angle: number) {
        const angleToCheck = Math.abs(angle);
        if (angleToCheck < 15) {
            return 'line';
        } else if (angleToCheck < 90) {
            return 'corner';
        } else if (angleToCheck < 360) {
            return 'curve';
        }
    }
    isLetter(lineGroup: any): string {
        console.log(lineGroup)
        let result = "";
        if (lineGroup.strokeCount === 1) {
            console.log("one stroke letter!")
            if (lineGroup.lineStrokes[0].isVertical === true && lineGroup.lineStrokes[0].isStraightCornerCurve === 'corner') {
                console.log("letter: V");
                result = "V";
            } else if (lineGroup.lineStrokes[0].isVertical === true && lineGroup.lineStrokes[0].isStraightCornerCurve === 'curve') {
                console.log("letter: U");
                result = "U";
            } else if (lineGroup.lineStrokes[0].isHorizontal === true && lineGroup.lineStrokes[0].isStraightCornerCurve === 'curve') {
                console.log("letter: C");
                result = "C";
            } else if (lineGroup.lineStrokes[0].isVertical === true) {
                console.log("letter: I");
                result = "I";
            }
        } else if (lineGroup.strokeCount === 2) {
            console.log("two stroke letter!")
            if (lineGroup.lineStrokes[0].isHorizontal === true && lineGroup.lineStrokes[1].isHorizontal === false) {
                console.log("letter: L");
                result = "L";
            }
        } else if (lineGroup.strokeCount === 3) {
            if (lineGroup.lineStrokes[0].isVertical === true && lineGroup.lineStrokes[1].isVertical === true && lineGroup.lineStrokes[2].isHorizontal === true) {
                console.log("letter: H");
                result = "H";
            } else if (lineGroup.lineStrokes[0].isVertical === true && lineGroup.lineStrokes[1].isHorizontal === true && lineGroup.lineStrokes[2].isHorizontal === true) {
                console.log("letter: F");
                result = "F";
            }
        } else if (lineGroup.strokeCount === 4) {
            if (lineGroup.lineStrokes[0].isVertical === true && lineGroup.lineStrokes[1].isHorizontal === true && lineGroup.lineStrokes[2].isHorizontal === true && lineGroup.lineStrokes[2].isHorizontal === true) {
                console.log("letter: E");
                result = "E";
            }
        }
        return result;
    }
}