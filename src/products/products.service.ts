import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto, EditProductDto } from './dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  getProducts() {
    return this.prisma.products.findMany();
  }

  getProductsById(productId: number) {
    return this.prisma.products.findFirst({
      where: {
        id: productId,
      },
    });
  }

  async createProduct(dto: CreateProductDto) {
    const product = await this.prisma.products.create({
      data: {
        ...dto,
      },
    });

    return product;
  }

  async editProductById(productId: number, dto: EditProductDto) {
    const product = await this.prisma.products.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) throw new ForbiddenException('Access to resources denied');

    return this.prisma.products.update({
      where: {
        id: productId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteProductById(bookmarkId: number) {
    const bookmark = await this.prisma.products.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookmark) throw new ForbiddenException('Access to resources denied');

    await this.prisma.products.delete({
      where: {
        id: bookmarkId,
      },
    });
  }
}
