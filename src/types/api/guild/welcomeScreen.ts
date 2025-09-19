import { Library } from "../../conversion";
import { APIWelcomeScreenChannel } from "./welcomeScreenChannel";

export type APIWelcomeScreen = {
    description: string | null;
    welcome_channels: APIWelcomeScreenChannel[];
}

export type WelcomeScreen = Library<APIWelcomeScreen>;