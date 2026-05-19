import os
import json

# 图标目录名
ICONS_DIR_NAME = "Icons"

# 输出JSON文件名
OUTPUT_JSON = "images.json"

# scriptsForPython 目录
current_dir = os.path.dirname(os.path.abspath(__file__))

# 目标扫描目录：Icons/
icons_dir = os.path.join(
    os.path.abspath(os.path.join(current_dir, "..")), ICONS_DIR_NAME
)

# 支持的图片扩展名
IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"]

# 输出 JSON 文件路径
json_path = os.path.join(os.environ.get("OUTPUT_DIR", "."), OUTPUT_JSON)


def build_image_tree(path, base_dir, depth=0):
    # 结果字典
    tree = {}

    try:
        # 获取当前目录下所有的文件和子目录
        items = os.listdir(path)
    except PermissionError:
        # 处理无权限访问的情况
        return None

    for item in items:
        full_path = os.path.abspath(os.path.join(path, item))

        if os.path.isdir(full_path):
            # 如果是目录，递归调用
            sub_tree = build_image_tree(full_path, base_dir, depth + 1)
            # 只有当子目录内部含有图片时，才将其加入树中
            if sub_tree:
                sub_tree["_depth"] = depth + 1
                sub_tree["_full_path"] = os.path.relpath(full_path, base_dir).replace("\\", "/")
                sub_tree["_parent_path"] = os.path.dirname(sub_tree["_full_path"])
                tree[item] = sub_tree

        elif os.path.isfile(full_path):
            # 如果是文件，检查后缀
            if any(item.lower().endswith(ext) for ext in IMAGE_EXTS):
                # 计算相对路径，统一使用 / 分隔符并存入字典
                tree[item] = os.path.relpath(full_path, base_dir).replace("\\", "/")

    return tree

def sort_json_data(data):
    """
    递归排序 JSON 数据，遵循规则：
    1. _ 开头属性置顶
    2. 基本类型优先 (str/int/float/bool/None)
    3. 嵌套对象/dict/list 优先级低
    4. 同级别按字母顺序排序
    """
    # 如果是字典，排序
    if isinstance(data, dict):
        # 定义排序 key
        def key_func(item):
            k, v = item
            # 1. 下划线开头 → 优先级最高 (0)
            if k.startswith('_'):
                priority = 0
            # 2. 基本类型 → 优先级中等 (1)
            elif isinstance(v, (str, int, float, bool, type(None))):
                priority = 1
            # 3. 嵌套对象/数组 → 优先级最低 (2)
            else:
                priority = 2
            # 返回排序依据：优先级 → 字母顺序
            return (priority, k)

        # 排序并递归处理子元素
        sorted_items = sorted(data.items(), key=key_func)
        return {k: sort_json_data(v) for k, v in sorted_items}

    # 如果是列表，递归处理每个元素
    elif isinstance(data, list):
        return [sort_json_data(item) for item in data]

    # 基本类型直接返回
    else:
        return data


def save_to_json(data, output_file):
    """
    将数据保存为 JSON 文件，到 docs/ 目录
    """
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(sort_json_data(data), f, indent=2, ensure_ascii=False)
    print(f"✅ {OUTPUT_JSON} 已生成：{output_file}")


if not os.path.isdir(icons_dir):
    print(f"错误: 未找到目录 {icons_dir}")
else:
    result = build_image_tree(icons_dir, "")
    if result is not None:
        result["_depth"] = 0
        result["_full_path"] = ICONS_DIR_NAME
        result["_parent_path"] = ""
        result = {ICONS_DIR_NAME: result}
        save_to_json(result, json_path)
