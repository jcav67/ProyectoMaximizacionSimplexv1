import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

interface FO{
  id:number;
  valor:number;
}
interface Restri{
  id:number;
  cf:FO[]
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ProyectoMaximizacion';

  @ViewChild('miFormulario') miFormulario!:NgForm;
  x:FO[]=[];
  cantidadVariables:number= 0;
  cantidadRestricciones:number=0;
  arrFO:FO[]=[];
  arrRestricciones:Restri[]=[];
  arrBandera:FO[]=[];
  arrFantasma:number[]=[]
  nuevaRestri!:Restri;
  contador:number=0;
  columnas:number=0;
  banderaRestri:Restri={
    id:0,
    cf:this.x
  };
  arrCompleto:number[][]=[]
  matrizIdentidad:number[][]=[]
  filaIdentidad:number[]=[]
  bandera:boolean=false;
  crearRestri:boolean=false;
  solucion:any;
  crearFO(){
    for(var i=0;i<this.cantidadVariables;i++){
      const nuevo:FO={
        id:i,
        valor:0
      }
      this.arrFO.push(nuevo);
    }
    this.bandera=true
  }

  crearRestricciones(){
    this.arrCompleto.pop();
    for(var i=0; i<this.cantidadRestricciones;i++){
      this.arrBandera=[]
      for(var j=0;j<(this.cantidadVariables+1);j++){
        const nuevo:FO={
          id:j+(i*(this.cantidadVariables+1)),
          valor:0
        }
        this.arrBandera.push(nuevo);
        this.nuevaRestri={
          id:i,
          cf:this.arrBandera
        }
        
      }
      this.arrRestricciones.push(this.nuevaRestri)
    }
    this.crearRestri=true;
    // for(var j=0;j<(this.cantidadVariables+1);j++){
    //   this.arrFantasma.push(j);
    // }
    for(var i=0;i<this.cantidadRestricciones;i++){
      this.filaIdentidad=[]
      for(var j=0;j<this.cantidadRestricciones;j++){
        if(i==j){
          this.filaIdentidad.push(1)
        } 
        else{
          this.filaIdentidad.push(0)
        }
      }
      this.matrizIdentidad.push(this.filaIdentidad);
    }
    this.columnas=this.cantidadRestricciones+this.cantidadVariables+1;
    
  }

  Procedimiento(){
    for( var i=0;i<this.cantidadRestricciones;i++){
      this.arrFantasma=[]
      for(var j=0;j<this.cantidadVariables+1;j++){
        this.arrFantasma.push(Math.abs(this.arrRestricciones[i].cf[j].valor))
        console.log(this.arrFantasma[j])
      }
      for(var c=0;c<this.cantidadRestricciones;c++){
        this.arrFantasma.push(this.matrizIdentidad[i][c])
      }
      console.log(this.arrFantasma)
      this.arrCompleto.push(this.arrFantasma);
    }
    this.arrFantasma=[]
    for(var i=0; i<this.columnas;i++){
      if(i<this.cantidadVariables){
        this.arrFantasma.push((this.arrFO[i].valor)*-1)
      }
      else{
        this.arrFantasma.push(0)
      }
    }
    this.arrCompleto.push(this.arrFantasma);
   
    var bandera=false;
    var x=0
    while(x<7){
      this.arrFantasma=[]
      for(var i=0; i<this.columnas;i++){
        if(i==this.cantidadVariables){
          continue;
        }
        this.arrFantasma.push(this.arrCompleto[this.cantidadRestricciones][i]);
      }
      console.log(this.arrFantasma)
      this.arrFantasma=this.arrFantasma.sort((n1,n2)=> n1 - n2);
      console.log(this.arrFantasma)
      var Minimo=this.arrFantasma[0]
      console.log("Minimo")
      console.log(Minimo)
      if(Minimo>=0){
        break;
      }
      var posMinimo=this.arrCompleto[this.cantidadRestricciones].indexOf(Minimo)
      console.log("posicion Minimo")
      console.log(posMinimo)
      var arrDivisiones:number[]=[]
      for(var i=0; i<this.cantidadRestricciones;i++){
        arrDivisiones.push(this.arrCompleto[i][this.cantidadVariables]/this.arrCompleto[i][posMinimo])
      }
      console.log(arrDivisiones)
      this.arrFantasma=[]
      for(var i=0; i<arrDivisiones.length;i++){
        this.arrFantasma.push(arrDivisiones[i]);
      }
      this.arrFantasma.sort((n1,n2)=> n1 - n2);
      for(var i=0; i<this.arrFantasma.length;i++){
        if(this.arrFantasma[i]<0){
          this.arrFantasma.shift()
        }
      }
      var minDivisiones=this.arrFantasma[0];
      var pivote= arrDivisiones.indexOf(minDivisiones)
      var dividendo= this.arrCompleto[pivote][posMinimo]
      console.log(minDivisiones)
      //Convertir el pivote en 1
      for(var i=0; i<this.columnas;i++){
        this.arrCompleto[pivote][i]=this.arrCompleto[pivote][i]/dividendo
      }
      //convertir las columnas en 0
      for(var i=0; i<this.arrCompleto.length;i++){
        if(i==pivote){
          continue;
        }
        var inversoAditivo=this.arrCompleto[i][posMinimo]*-1;
        for(var j=0; j<this.columnas;j++){
          this.arrCompleto[i][j]=this.arrCompleto[i][j]+(this.arrCompleto[pivote][j]*inversoAditivo)
        }
      }
      x+=1;
    }
    
    //this.miFormulario.reset();
  }

}
