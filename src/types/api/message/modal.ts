import { Library } from "../../conversion";
import { Label } from "./label";
import { StringSelect } from "./stringSelect";
import { TextDisplay } from "./textDisplay";
import { TextInput } from "./textInput";

type ModalComponent = TextInput | Label | StringSelect | TextDisplay;

export type APIModal = {
    custom_id: string;
    title: string;
    components: ModalComponent[];
}

export type Modal = Library<APIModal>;