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


def build_image_tree(path, base_dir):
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
            sub_tree = build_image_tree(full_path, base_dir)
            # 只有当子目录内部含有图片时，才将其加入树中
            if sub_tree:
                tree[item] = sub_tree

        elif os.path.isfile(full_path):
            # 如果是文件，检查后缀
            if any(item.lower().endswith(ext) for ext in IMAGE_EXTS):
                # 计算相对路径
                rel = os.path.relpath(full_path, base_dir)
                # 统一使用 / 分隔符并存入字典
                tree[item] = rel.replace("\\", "/")

    return tree


def save_to_json(data, output_file):
    """
    将数据保存为 JSON 文件，到 docs/ 目录
    """
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"✅ {OUTPUT_JSON} 已生成：{output_file}")


if not os.path.isdir(icons_dir):
    print(f"错误: 未找到目录 {icons_dir}")
else:
    result = build_image_tree(icons_dir, "")
    result = { "Icons": result }
    save_to_json(result, json_path)
