// ?? 在 JavaScript classes(类)中， 在定义子类的构造函数时，你需要始终调用 super 。
// 所有具有 constructor 的 React 组件类都应该以 super(props) 调用启动它。

// ?? 即使我们我们每隔 1 秒都重建了整个元素, 但实际上 React DOM 只更新了修改过的文本节点.

// React是非常灵活的，但它也有一个严格的规则：所有的React组件必须像纯函数那样使用它们的props。

// 类就允许我们使用其它特性，例如局部状态、生命周期钩子

// 生命周期： componentDidMount/ componentWillUnmount

// 数件处理函数的写法：
// 1.constructor中bind（OK）
// 2.属性初始化器（提案）
// 3.写成箭头函数（性能问题）

