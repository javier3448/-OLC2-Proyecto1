import { AstNode } from "./AstNode";
import { MemberAccess } from './MemberAccess';

// even though we have typeof and instanceof in typescript this is necessary because 
// jison does some weird js things and sometimes we like 'loose the type and its
// functions'. idk
export enum ExpressionKind{
    //binary
    LESS = '<',
    GREATER = '>',
    LESS_OR_EQUAL = '<=',
    GREATER_OR_EQUAL = '>=',
    EQUAL_EQUAL = '==',
    NOT_EQUAL = '!=',
    OR = 'OR',
    AND = 'AND',

    ADDITION = '+',
    SUBSTRACTION = '-',
    MULTIPLICATION = '*',
    DIVISION = '/',
    POWER = '**',
    ASSIGNMENT = '=',

    //unary
    UNARY_MINUS = '-',
    NEGATION = '!',
    POSTFIX_INC = '++',
    POSTFIX_DEC = '--',

    //ternary
    TERNARY = '?',

    //Atomic
    MEMBER_ACCESS = 'MemberAccess',
    LITERAL = 'LITERAL',
    IDENTIFIER = 'IDENTIFIER',
    FUNCTION_CALL = 'FUNCTION_CALL',
    OBJECT_LITERAL = 'OBJECT_LITERAL',
}

export class UnaryExpression{
    constructor(public expr:Expression){   }
}

export class BinaryExpression{
    constructor(public left:Expression, public right:Expression){   }
}

export class TernaryExpression{
    constructor(public left:Expression, public middle:Expression, public right:Expression){   }
}

export class LiteralExpression{
    constructor(public literal:(String | Number | Boolean | undefined | null)){   }
}

export class IdentifierExpression{
    constructor(public name:string){   }
}

export class FunctionCallExpression{
    constructor(public name:string, public functionArgs:Expression[]){   }
}

export class MemberAccessExpression{
    constructor(public expression:Expression, public memberAccess:MemberAccess){   }
}

export class ObjectLiteralExpression{
    constructor(public propertyNodes:PropertyNode[]){   }
}

export class PropertyNode{

    astNode:AstNode;

    id:string;
    expr:Expression;

    constructor(id:string, expr:Expression,
                firstLine:number, firstColumn:number, lastLine:number, lastColumn:number){

        this.astNode = new AstNode(firstLine, firstColumn, lastLine, lastColumn);

        this.id  = id;
        this.expr = expr;
    }
    
}

export class Expression {
    //Common AST attributes
    public astNode: AstNode;

    public expressionKind: ExpressionKind;
    // TODO: Think of a better name, might not be possible
    public specification: (UnaryExpression | BinaryExpression | TernaryExpression | IdentifierExpression | LiteralExpression | MemberAccessExpression | ObjectLiteralExpression);

    constructor(expressionKind:ExpressionKind, specification:(UnaryExpression | BinaryExpression | TernaryExpression | LiteralExpression | MemberAccessExpression | ObjectLiteralExpression),
                firstLine:number, firstColumn:number, lastLine:number, lastColumn:number){

        this.astNode = new AstNode(firstLine, firstColumn, lastLine, lastColumn);

        //assertions
        //TODO: las exceptions ocn typeof(ads;fkj) no van a imprimir nada util cambiar a class.name o lo que sea que use typescript
        switch(expressionKind){
            //binary
            case ExpressionKind.LESS:
            case ExpressionKind.GREATER:
            case ExpressionKind.LESS_OR_EQUAL:
            case ExpressionKind.GREATER_OR_EQUAL:
            case ExpressionKind.EQUAL_EQUAL:
            case ExpressionKind.NOT_EQUAL:
            case ExpressionKind.OR:
            case ExpressionKind.AND:
            case ExpressionKind.ADDITION:
            case ExpressionKind.SUBSTRACTION:
            case ExpressionKind.MULTIPLICATION:
            case ExpressionKind.DIVISION:
            case ExpressionKind.ASSIGNMENT:
            case ExpressionKind.POWER:
                if(!(specification instanceof BinaryExpression)){
                    throw new Error(`Assertion Error: Operator ${expressionKind.toString()} must be Type BinaryExpression insstead of ${(specification)}`);
                }
            break;

            //unary
            case ExpressionKind.UNARY_MINUS:
            case ExpressionKind.POSTFIX_INC:
            case ExpressionKind.POSTFIX_DEC:
            case ExpressionKind.NEGATION:
                if(!(specification instanceof UnaryExpression)){
                    throw new Error(`Assertion Error: Operator ${expressionKind.toString()} must be type UnaryExpression instead of ${(specification)}`);
                }
            case ExpressionKind.IDENTIFIER:
                if(!(specification instanceof IdentifierExpression)){
                    throw new Error(`Assertion Error: expressionKind ${expressionKind.toString()} must be type IdentifierExpression instead of ${(specification)}`);
                }
            break;
            case ExpressionKind.FUNCTION_CALL:
                if(!(specification instanceof FunctionCallExpression)){
                    throw new Error(`Assertion Error: expressionKind ${expressionKind.toString()} must be type IdentifierExpression instead of ${(specification)}`);
                }
            break;
            case ExpressionKind.LITERAL:
                if(!(specification instanceof LiteralExpression)){
                    throw new Error(`Assertion Error: expressionKind ${expressionKind.toString()} must be type LiteralExpression instead of ${(specification)}`);
                }
            break;

            //ternary
            case ExpressionKind.TERNARY:
                if(!(specification instanceof TernaryExpression)){
                    throw new Error(`Assertion Error: expressionKind ${expressionKind.toString()} must be type TernaryExpression instead of ${(specification)}`);
                }
            break;
            case ExpressionKind.MEMBER_ACCESS:
                if(!(specification instanceof MemberAccessExpression)){
                    throw new Error(`Assertion Error: expressionKind ${expressionKind.toString()} must be type MemberAccessExpression instead of ${(specification)}`);
                }
            break;
            case ExpressionKind.OBJECT_LITERAL:
                if(!(specification instanceof ObjectLiteralExpression)){
                    throw new Error(`Assertion Error: expressionKind ${expressionKind.toString()} must be type MemberAccessExpression instead of ${(specification)}`);
                }
            break;
            //Solo para que no se nos olvide incluir todos los operadores posibles en este switch
            default:
                console.log(this);
                throw new Error(`[!!!] No se ha implementado todavia el operador ${expressionKind}`);
        }

        this.expressionKind = expressionKind;
        this.specification = specification;
    }
}