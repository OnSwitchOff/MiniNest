import {Injectable} from "../../framework/decorators/injectable";

export interface User {
    id: string;
    name: string;
}

@Injectable()
export class UserService {
    private users: User[] = []; // in-memory store
    private idCounter = 1;

    // Find user by ID
    findUserById(id: string): User | null {
        return this.users.find(u => u.id === id) || null;
    }

    // Search users by name
    searchByName(name?: string): User[] {
        if (!name) return this.users;
        return this.users.filter(u => u.name.toLowerCase().includes(name.toLowerCase()));
    }

    // Create new user
    createUser(name: string): User {
        const user: User = { id: String(this.idCounter++), name };
        this.users.push(user);
        return user;
    }
}