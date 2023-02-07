import fs from "fs"
import { v4 as uuidv4 } from 'uuid'


class ProductManager {
  constructor(path){
    this.products = []
    this.path = path
  }
  async checkDB(){
    if(fs.existsSync(this.path)){
      this.products = JSON.parse(await fs.promises.readFile(this.path))
    }
  }
  async updateDB(){
    await fs.promises.writeFile(this.path, JSON.stringify(this.products))
  }

  async addProduct(title, description, price, thumbnail, code, stock){
    await this.checkDB()
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
      this.updateDB
      return "Producto agregado"
    }else{
      return "Producto repetido"
    }
  }
  async getProducts(){
    await this.checkDB()
    return this.products
  }
  async getProductById(id){
    await this.checkDB()
    const productFound = this.products.find(product => product.id === id)
    if (productFound){
      return productFound
    }else{
      return "No se encuentra el producto"
    }
  }
  async updateProduct(id, title, description, price, thumbnail, code, stock){
    await this.checkDB()
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
      await this.updateDB()
      return "Producto actualizado"
    }else{
      return "No se encuentra el producto"
    }
  }
  async deleteProduct(id){
    await this.checkDB()
    const indexFound = this.products.findIndex(product => product.id === id)
    if(indexFound !== -1){
      this.products.splice(indexFound,indexFound+1)
      await this.updateDB()
      return "Producto eliminado"
    }else{
      return "No se encuentra el producto"
    }
  }
}

export const productManager = new ProductManager("./src/products.json")

productManager.addProduct("producto 1","descripción", 100, "Sin imagen","001",12)
productManager.addProduct("producto 2","descripción", 100, "Sin imagen","002",12)
productManager.addProduct("producto 3","descripción", 100, "Sin imagen","003",12)
productManager.addProduct("producto 4","descripción", 100, "Sin imagen","004",12)
productManager.addProduct("producto 5","caja", 123, "Sin imagen","005",12).then(val => console.log(val))
productManager.getProducts().then(val => console.log(val))


//Quitar comentario a la siguiente linea y colocar un id
//console.log(productManager.getProductById("6e30eaf8-2936-414b-9627-d9687342353d"))
//Quitar comentario a las dos lineas que siguen para ver que actualice el producto y verlo
//console.log(productManager.updateProduct("2f090b05-d3fd-4c60-a1d5-611191390c02", "producto 1 actualizado","descripción actualizada", 100, "Sin imagen","001",12))
//console.log(productManager.getProducts())
//Quitar comentario a la siguiente linea para ver como se elimina el producto
//console.log(productManager.deleteProduct("5d020c89-d6d8-46e1-ad48-d34b301d8326"))

