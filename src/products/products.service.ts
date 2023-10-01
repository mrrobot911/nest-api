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
    let category = await this.prisma.category.findFirst({
      where: {
        name: dto.category,
      },
    });
    if (category === null) {
      category = await this.prisma.category.create({
        data: {
          name: dto.category,
        },
      });
    }
    const product = await this.prisma.products.create({
      data: {
        title: dto.title,
        price: dto.price,
        category_id: category.id,
      },
    });
    const productImage = dto.images.map((image) => {
      return { ...image, product_id: product.id };
    });
    await this.prisma.images.createMany({
      data: productImage,
    });
    return dto;
  }

  async editProductById(productId: number, dto: EditProductDto) {
    const { category, images, ...etc } = dto;
    const product = await this.prisma.products.findUnique({
      where: {
        id: productId,
      },
    });
    let cat = null;
    if (category) {
      cat = await this.prisma.category.findFirst({
        where: {
          name: category,
        },
      });
      if (cat === null) {
        cat = await this.prisma.category.create({
          data: {
            name: category,
          },
        });
      }
    }
    if (!product) throw new ForbiddenException('Access to resources denied');

    return this.prisma.products.update({
      where: {
        id: productId,
      },
      data: {
        ...etc,
      },
    });
  }

  async deleteProductById(productId: number) {
    const product = await this.prisma.products.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) throw new ForbiddenException('Access to resources denied');

    await this.prisma.products.delete({
      where: {
        id: productId,
      },
    });
  }
}
