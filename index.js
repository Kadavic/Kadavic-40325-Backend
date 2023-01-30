import fs from "fs"
import { v4 as uuidv4 } from 'uuid'

class ProductManager {
  constructor(path){
    this.products = []
    this.path = path
  }
  checkDB(){
    if(fs.existsSync(this.path)){
      this.products = JSON.parse(fs.readFileSync(this.path))
    }
  }
  addProduct(title, description, price, thumbnail, code, stock){
    this.checkDB()
    const isInArray = this.products.some(product => product.code === code)
    if(isInArray === false && title && description && price && thumbnail && stock){
      this.products.push({
        id: uuidv4(),
        title: title,
        description: description,
        price: price,
        thumbnail: thumbnail,
        code: code,
        stock: stock
      });
      fs.writeFileSync(this.path, JSON.stringify(this.products))
      return "Producto agregado"
    }else{
      return "Producto repetido"
    }
  }
  getProducts(){
    return this.products
  }
  getProductById(id){
    this.checkDB()
    const productFound = this.products.find(product => product.id === id)
    if (productFound){
      return productFound
    }else{
      return "No se encuentra el producto"
    }
  }
  updateProduct(id, title, description, price, thumbnail, code, stock){
    this.checkDB()
    const indexFound = this.products.findIndex(product => product.id === id)
    if(indexFound !== -1){
      this.products[indexFound] = {
        id: id,
        title: title,
        description: description,
        price: price,
        thumbnail: thumbnail,
        code: code,
        stock: stock
      }
      fs.writeFileSync(this.path, JSON.stringify(this.products))
      return "Producto actualizado"
    }else{
      return "No se encuentra el producto"
    }
  }
  deleteProduct(id){
    this.checkDB()
    const indexFound = this.products.findIndex(product => product.id === id)
    if(indexFound !== -1){
      this.products.splice(indexFound,indexFound+1)
      fs.writeFileSync(this.path, JSON.stringify(this.products))
      return "Producto eliminado"
    }else{
      return "No se encuentra el producto"
    }
  }
}
const productManager = new ProductManager("./products.json")

console.log(productManager.addProduct("producto 1","descripción", 100, "Sin imagen","001",12))
console.log(productManager.addProduct("producto 2","descripción", 100, "Sin imagen","002",12))
console.log(productManager.addProduct("producto 3","descripción", 100, "Sin imagen","003",12))
console.log(productManager.addProduct("producto 4","descripción", 100, "Sin imagen","004",12))
console.log(productManager.getProducts())

//Quitar comentario a la siguiente linea y colocar un id
//console.log(productManager.getProductById("6e30eaf8-2936-414b-9627-d9687342353d"))
//Quitar comentario a las dos lineas que siguen para ver que actualice el producto y verlo
console.log(productManager.updateProduct("2f090b05-d3fd-4c60-a1d5-611191390c02", "producto 1 actualizado","descripción actualizada", 100, "Sin imagen","001",12))
//console.log(productManager.getProducts())
//Quitar comentario a la siguiente linea para ver como se elimina el producto
console.log(productManager.deleteProduct("cbfe5e84-813e-42be-a954-86c7cbe3c5bc"))