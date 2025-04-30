import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { MarcaEntity } from '../marca/marca.entity';

@Entity({ name: 'veiculos' })
export class VeiculoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'modelo', length: 30, nullable: false })
  modelo: string;

  @Column({ name: 'ano', type: 'numeric', precision: 4, nullable: false })
  ano: number;

  @Column({ name: 'valor', type: 'decimal', precision: 13, scale: 2, nullable: false })
  valor: number;

  @ManyToOne(() => MarcaEntity, (marca) => marca.veiculos, {
    cascade: false,
    eager: true,
    nullable: false
  })
  marca: MarcaEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;
}
