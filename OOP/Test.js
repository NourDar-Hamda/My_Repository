// //super class
// class Shape {
 
//     //name
//     //heihgt
//     //width
 
//     constructor(name, height, width) {
//         this.name = name
//         this.height = height
//         this.width = width
//     }
 
//     area() {
//         //some calcuations
//         return -1
//     }
 
//     printDatails() {
//         console.log("Name is: " + this.name + " ----- " + "height is: " + this.height + " ----- " + "Width is: " + this.width)
//     }
// }
 
// // sub class -- child class
// class Circle extends Shape {
 
//     pi = 3.14
//     constructor(name, height, width, radius) {
//         super(name, height, width)
//         this.radius = radius
//     }
 
//     //Override function
//     area() {
//         let calculateArea = this.pi * this.radius * this.radius
//         return calculateArea
//     }
 
//     printArea() {
//         console.log("This is Circle: " + this.area())
//     }
// }
 
// class Rectangle extends Shape {
 
//     constructor(name, height, width) {
//         super(name, height, width)
//     }
 
//     //override function
//     area() {
//         return this.height * this.width
//     }
 
//     printArea() {
//         var shape4 = new Rectangle("Rect1", 8, 8)
//         console.log("This is Rectangke: " + this.area())
//     }
// }
 
// var shape1 = new Circle("Circle1", 10, 5, 2)
// var shape2 = new Rectangle("Rect1", 8, 8)
// var shape3 = new Rectangle("Rect1", 8, 8)
// var shape4 = new Rectangle("Rect1", 8, 8)
 
 
// let array = ["Yasser", 10]
// let shapes = [shape1, shape2, shape3, shape4] // array of shapes

 
// for(i= 0; i<shapes.length; i++) {
//     let shape = shapes[i]
//     shape.printArea()
// }
class Car {
    constructor(id,wheelsNumber,color,year){
        this.id=id;
        this.wheelsNumber=wheelsNumber;
        this.color=color;
        this.year=year;
        this.startEngine=false;
    }
    start_engin(){
        this.startEngine=true;
        console.log("Engine started!");
    }
    stop_engin(){
        this.startEngine=false;
        console.log("Engine stoped!\n\n");
    }

    printDatails() {
            console.log("Car id is: " + this.id + "\n" + "The Number of wheels is: " + this.wheelsNumber+ " \n" + "Color is: " + this.color);
            console.log("Year is: "+this.year);
        }

}
class Audi extends Car{
    constructor(model,id,wheelsNumber,color,year){
        super(id,wheelsNumber,color,year);
        this.carMake="Audi";
        this.model=model;

    }
    printDatails(){
        console.log("Car make is: "+this.carMake+"\nModel is: "+this.model);
        super.printDatails();
    }

}
class Bmw extends Car{
    constructor(model,id,wheelsNumber,color,year){
        super(id,wheelsNumber,color,year);
        this.carMake="BMW";
        this.model=model;

    }
    printDatails(){
        console.log("Car make is: "+this.carMake+"\nModel is: "+this.model);
        super.printDatails();
    } 
}
class Ford extends Car{
    constructor(model,id,wheelsNumber,color,year){
        super(id,wheelsNumber,color,year);
        this.carMake="Ford";
        this.model=model;

    }
    printDatails(){
        console.log("Car make is: "+this.carMake+"\nModel is: "+this.model);
        super.printDatails();
    }
}
class Jeep extends Car{
    constructor(model,id,wheelsNumber,color,year){
        super(id,wheelsNumber,color,year);
        this.carMake="Jeep";
        this.model=model;

    }
    printDatails(){
        console.log("Car make is: "+this.carMake+"\nModel is: "+this.model);
        super.printDatails();
    }
}
class Mercedes extends Car{
    constructor(model,id,wheelsNumber,color,year){
        super(id,wheelsNumber,color,year);
        this.carMake="Mercedes";
        this.model=model;

    }
    printDatails(){
        console.log("Car make is: "+this.carMake+"\nModel is: "+this.model);
        super.printDatails();
    }
}
class Tesla extends Car{
    constructor(model,id,wheelsNumber,color,year){
        super(id,wheelsNumber,color,year);
        this.carMake="Tesla";
        this.model=model;

    }
    printDatails(){
        console.log("Car make is: "+this.carMake+"\nModel is: "+this.model);
        super.printDatails();
    }  
}

var car1=new Audi("e-tron GT",1111,4,"Black",2023)
var car2=new Bmw("X5 Series",2222,4,"Grey",2018)
var car3=new Ford("Fusion",3333,4,"White",2019)
var car4=new Jeep("Grand Cherokee",4444,4,"Burgundy",2014)
var car5=new Mercedes("E-Class",5555,4,"Baby Blue",2004)
var car6=new Tesla("Model X",6666,4,"Silver",2017)

let cars=[car1,car2,car3,car4,car5,car6]
for(i=0;i<cars.length;i++){
    let thisCar=cars[i]
    cars[i].start_engin()
    cars[i].printDatails()
    cars[i].stop_engin()
}

