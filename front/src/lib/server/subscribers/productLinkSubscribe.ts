import { type EntitySubscriberInterface, EventSubscriber, type InsertEvent } from 'typeorm';
import { Link } from "$entities/Link";
import { Task } from "$entities/Task";

@EventSubscriber()
export class ProductLinkSubscriber implements EntitySubscriberInterface<Link> {
	listenTo() {
		return Link;
	}

	async afterInsert(event: InsertEvent<Link>) {
		const task = Task.create();
		task.name = 'Добавлена новая ссылка';
		task.body = 'Добавлена новая ссылка - описание';

		await task.save();
	}
}