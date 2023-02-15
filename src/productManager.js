import fs from "fs"
import { v4 as uuidv4 } from 'uuid'


class ProductManager {
  constructor(path){
    this.products = []
    this.path = path
  }

  async checkDB(){
      this.products = JSON.parse(await fs.promises.readFile(this.path))
  }

  async updateDB(){
      await fs.promises.writeFile(this.path, JSON.stringify(this.products))
  }

  async addProduct({title, description, code, price, status=true, stock, category, thumbnails=[]}){
    await this.checkDB()
    const isInArray = this.products.some(product => product.code === code)
    return new Promise((res,rej)=>{
      if(isInArray === false){
        this.products.push({
          id: uuidv4(),
          title: title,
          description: description,
          code: code,
          price: price,
          status: status,
          stock: stock,
          category: category,
          thumbnails: thumbnails    
        });
        this.updateDB().then(
          res("Producto agregado")
        )
      }else{
        rej("Producto repetido")
      }
    })
    
  }

  async getProducts(){
    await this.checkDB()
    return new Promise((res,rej)=>{
      if(this.products){
        res(this.products)
      }else{
        rej("Producto no encontrado")
      }
    })
  }

  async getProductById(id){
    await this.checkDB()
    const productFound = this.products.find(product => product.id === id)
    return new Promise((res,rej)=>{
      if(productFound){
        res(productFound)
      }else{
        rej("producto no encontrado")
      }
    })
  }

  async updateProduct({id, title, description, code, price, status, stock, category, thumbnails}){
    await this.checkDB()
    const indexFound = this.products.findIndex(product => product.id === id)
    return new Promise((res,rej)=>{
      if(indexFound !== -1){
        this.products[indexFound] = {
          id: id,
          title: title,
          description: description,
          code: code,
          price: price,
          status: status,
          stock: stock,
          category: category,
          thumbnails: thumbnails 
        }
        this.updateDB().then(
          res("Producto actualizado")  
        )
      }else{
        rej("producto no encontrado") 
      }
    })
  }

  async deleteProduct(id){
    await this.checkDB()
    const indexFound = this.products.findIndex(product => product.id === id)
    return new Promise((res,rej)=>{
      if(indexFound !== -1){
        this.products.splice(indexFound,indexFound+1)
        this.updateDB().then(
          res("producto borrado") 
        )
      }else{
        rej("producto no encontrado")
      }
    })
  }
}

export const productManager = new ProductManager("./src/products.json")



//Quitar comentario a la siguiente linea y colocar un id
//console.log(productManager.getProductById("6e30eaf8-2936-414b-9627-d9687342353d"))
//Quitar comentario a las dos lineas que siguen para ver que actualice el producto y verlo
//console.log(productManager.updateProduct("2f090b05-d3fd-4c60-a1d5-611191390c02", "producto 1 actualizado","descripción actualizada", 100, "Sin imagen","001",12))
//console.log(productManager.getProducts())
//Quitar comentario a la siguiente linea para ver como se elimina el producto
//console.log(productManager.deleteProduct("5d020c89-d6d8-46e1-ad48-d34b301d8326"))

