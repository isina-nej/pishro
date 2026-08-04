-- AlterTable: allow longer testimonial / comment bodies
ALTER TABLE `Comment` MODIFY `text` TEXT NOT NULL;
