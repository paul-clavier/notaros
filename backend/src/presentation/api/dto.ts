export interface ResponseDto<Result, DTO> {
    data: Result;
    fromResult: () => DTO;
}

export interface RequestDto<Port, DTO> {
    data: DTO;
    toPort: () => Port;
}
