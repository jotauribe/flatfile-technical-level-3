import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { SectionEntity } from './Section'

@Entity({ name: 'cards' })
export class CardEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column({ name: 'section_id' })
  sectionId: number

  @Column({ name: 'parent_id' })
  parentId: number

  @ManyToOne(() => SectionEntity, (section) => section.cards)
  @JoinColumn({ name: 'section_id' })
  section: SectionEntity

  @ManyToOne(() => CardEntity, (card) => card.id)
  @JoinColumn({ name: 'parent_id' })
  parent: CardEntity

  @OneToMany(() => CardEntity, (card) => card.parent)
  @JoinColumn({ referencedColumnName: 'parent_id' })
  subtasks: CardEntity[]
}
