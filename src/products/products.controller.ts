import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, EditProductDto } from './dto';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}
  @Get()
  getProducts() {
    return this.productsService.getProducts();
  }

  @Get(':id')
  getProductsById(@Param('id', ParseIntPipe) productId: number) {
    return this.productsService.getProductsById(productId);
  }

  @Post()
  createProduct(@Body() dto: CreateProductDto) {
    return this.productsService.createProduct(dto);
  }

  @Patch(':id')
  editProductById(
    @Param('id', ParseIntPipe) productId: number,
    @Body() dto: EditProductDto,
  ) {
    return this.productsService.editProductById(productId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteProductById(@Param('id', ParseIntPipe) productId: number) {
    return this.productsService.deleteProductById(productId);
  }
}
