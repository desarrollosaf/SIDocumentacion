import { DocTipoApoyo } from './docs-tipo-apoyo.entity';
export declare class TipoApoyo {
    id: number;
    tipo: string | null;
    created_at: Date | null;
    updated_at: Date | null;
    docsApoyo?: DocTipoApoyo[];
}
