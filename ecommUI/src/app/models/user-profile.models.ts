
export class User {
    public username: string;
    public email: string;
    public first_name: string;
    public last_name: string;
    public profile: Profile;

    constructor(username: string, email: string, first_name: string, last_name: string,
        bio: string, company: string, location: string, phone: string) {
        this.username = username;
        this.email = email;
        this.first_name = first_name;
        this.last_name = last_name;
        this.profile = new Profile(bio, company, location, phone);
    }
}

export class Profile {
    public bio: string;
    public location: string;
    public company: string;
    public phone: string;

    constructor(bio: string, company: string, location: string, phone: string) {
        this.bio = bio;
        this.location = location;
        this.company = company;
        this.phone = phone;
    }
}
