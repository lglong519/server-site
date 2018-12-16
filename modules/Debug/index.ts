/**
 * @description 混合类型声明文件
 */
interface DebugLog{
	(args: any, ...restArgs: any): void;
 }

interface Debug {
	(namespace: string): DebugLog;
	enable(namespaces: string): void;
}

const debug: Debug = require('./src/node');
export = debug
